import { describe, expect, it } from 'vitest';
import {
  calculateAvgBuyPrice,
  calculateInvested,
  calculateTokenHoldings,
  formatAmount,
  formatQuantity,
  type ITransaction
} from './index';

const tx = (type: 'BUY' | 'SELL', amount: number, price: number, fees = 0): ITransaction => ({
  type,
  amount,
  price,
  fees,
  asset: 'BTC',
  currency: 'EUR',
  date: '',
  portfolioId: 'p1',
  transactionId: `${type}-${amount}-${price}`
});

describe('calculateTokenHoldings', () => {
  it('adds buys and subtracts sells', () => {
    expect(calculateTokenHoldings([tx('BUY', 1, 100), tx('BUY', 0.5, 200), tx('SELL', 0.3, 300)])).toBeCloseTo(1.2);
  });
});

describe('calculateAvgBuyPrice', () => {
  it('weights each buy by its quantity', () => {
    expect(calculateAvgBuyPrice([tx('BUY', 1, 10000), tx('BUY', 0.1, 20000)])).toBeCloseTo(10909.09, 2);
  });

  it('ignores sells', () => {
    expect(calculateAvgBuyPrice([tx('BUY', 2, 100), tx('SELL', 1, 500)])).toBe(100);
  });

  it('returns null when there is no buy', () => {
    expect(calculateAvgBuyPrice([tx('SELL', 1, 100)])).toBeNull();
  });
});

describe('calculateInvested', () => {
  it('includes fees', () => {
    expect(calculateInvested([tx('BUY', 2, 100, 10)])).toBe(210);
  });

  it('removes sold units at the average cost', () => {
    expect(calculateInvested([tx('BUY', 2, 100, 10), tx('SELL', 1, 500)])).toBe(105);
  });

  it('is 0 without buys', () => {
    expect(calculateInvested([])).toBe(0);
  });
});

describe('formatAmount', () => {
  it('formats with two decimals', () => {
    expect(formatAmount(10909.0909)).toBe('10,909.09');
  });

  it('shows a dash for missing values', () => {
    expect(formatAmount(null)).toBe('—');
  });
});

describe('formatQuantity', () => {
  it('hides floating-point noise', () => {
    expect(formatQuantity(1.1 - 0.5)).toBe('0.6');
  });
});
