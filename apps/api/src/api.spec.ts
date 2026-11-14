import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from './app.module';
import { setupApp } from './app/setup';

let mongo: MongoMemoryServer;
let app: INestApplication;

const api = () => request(app.getHttpServer());

const createPortfolio = async (portfolioName: string): Promise<string> => {
  const res = await api().post('/portfolios').send({ input: { portfolioName } }).expect(201);
  return res.body.result.portfolioId;
};

const transaction = (portfolioId: string, overrides: Record<string, unknown> = {}) => ({
  input: {
    type: 'BUY',
    portfolioId,
    date: '2024-01-01',
    currency: 'EUR',
    asset: 'BTC',
    amount: 1,
    price: 10000,
    fees: 0,
    ...overrides,
  },
});

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = setupApp(moduleRef.createNestApplication());
  await app.init();
});

afterAll(async () => {
  await app?.close();
  await mongoose.disconnect();
  await mongo?.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('POST /portfolios', () => {
  it('creates a portfolio and lists it', async () => {
    const portfolioId = await createPortfolio('  Long term  ');

    const res = await api().get('/portfolios').expect(200);
    expect(res.body.result).toHaveLength(1);
    expect(res.body.result[0]).toMatchObject({ portfolioId, portfolioName: 'Long term' });
  });

  it('rejects a duplicate name with a 400', async () => {
    await createPortfolio('Savings');

    const res = await api().post('/portfolios').send({ input: { portfolioName: 'Savings' } }).expect(400);
    expect(res.body.message).toBe('Portfolio already exists');
  });

  it('rejects a blank name with a 400', async () => {
    const res = await api().post('/portfolios').send({ input: { portfolioName: '   ' } }).expect(400);
    expect(res.body.message).toBe('Portfolio name is required');
  });

  it('rejects a payload without input', async () => {
    const res = await api().post('/portfolios').send({ portfolioName: 'Savings' }).expect(400);
    expect(res.body.message).toEqual(expect.arrayContaining([expect.stringContaining('input')]));
  });

  it('ignores a client-supplied portfolioId', async () => {
    const res = await api()
      .post('/portfolios')
      .send({ input: { portfolioName: 'Savings', portfolioId: 'forced-id' } })
      .expect(201);
    expect(res.body.result.portfolioId).not.toBe('forced-id');
  });
});

describe('DELETE /portfolios/:id', () => {
  it('deletes the portfolio', async () => {
    const portfolioId = await createPortfolio('Savings');

    const res = await api().delete(`/portfolios/${portfolioId}`).expect(200);
    expect(res.body.result.deletedCount).toBe(1);

    const list = await api().get('/portfolios').expect(200);
    expect(list.body.result).toHaveLength(0);
  });
});

describe('POST /transactions', () => {
  it('records transactions and groups them by asset on the portfolio', async () => {
    const portfolioId = await createPortfolio('Savings');

    await api().post('/transactions').send(transaction(portfolioId)).expect(201);
    await api()
      .post('/transactions')
      .send(transaction(portfolioId, { amount: 0.1, price: 20000 }))
      .expect(201);

    const res = await api().get(`/portfolios/${portfolioId}`).expect(200);
    const btc = res.body.result.assets.find((group: Array<{ asset: string }>) => group[0].asset === 'BTC');
    expect(btc).toHaveLength(2);
  });

  it.each([
    ['an unknown type', { type: 'SWAP' }],
    ['a zero amount', { amount: 0 }],
    ['a negative price', { price: -1 }],
    ['a price sent as text', { price: '10000' }],
    ['a missing asset', { asset: '' }],
  ])('rejects %s with a 400', async (_label, overrides) => {
    const portfolioId = await createPortfolio('Savings');
    await api().post('/transactions').send(transaction(portfolioId, overrides)).expect(400);
  });
});
