# Personal Finance Tracker

A personal finance app, built as a side project. Its first feature is a crypto portfolio tracker: create portfolios, log buy/sell transactions, and see your holdings and average buy price per asset.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Monorepo | Turborepo, pnpm workspaces                               |
| Frontend | Nuxt 3, Vue 3 (Composition API), Pinia, TypeScript       |
| Backend  | NestJS, Mongoose, Swagger, Winston                       |
| Database | MongoDB                                                  |
| Data     | Static coin list (CoinMarketCap integration in progress) |
| Tooling  | ESLint (shared config package), Prettier, Husky          |

## Repository layout

```
apps/
  web/                    Nuxt 3 front end (portfolio view, dashboard placeholder)
  api/                    NestJS REST API (portfolios, transactions)
packages/
  eslint-config-custom/   ESLint config shared across the workspace
```

## Getting started

### Prerequisites

- Node.js 18+
- pnpm 8: run `corepack enable` to use the version pinned in `package.json`, or `npm install -g pnpm@8` if corepack fails on your Node version
- A MongoDB instance (local or Atlas)

### Install

```bash
pnpm install
```

### Configure

The API reads its configuration from environment variables:

| Variable          | Required | Description                                          |
| ----------------- | -------- | ---------------------------------------------------- |
| `MONGO_URI`       | Yes      | MongoDB connection string                            |
| `CMC_PRO_API_KEY` | No       | CoinMarketCap API key, for the upcoming live prices  |

```bash
export MONGO_URI="mongodb://localhost:27017/personal-finance-tracker"
```

### Run

```bash
pnpm dev
```

Turborepo starts both apps in parallel:

- Web app: http://localhost:3000 (opens the portfolio view)
- API: http://localhost:9000, with Swagger docs at http://localhost:9000/api

## API overview

| Method | Route                         | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/portfolios`                 | Create a portfolio              |
| GET    | `/portfolios`                 | List portfolios                 |
| GET    | `/portfolios/:id`             | Get one portfolio               |
| DELETE | `/portfolios/:id`             | Delete a portfolio              |
| POST   | `/transactions`               | Add a buy/sell transaction      |
| GET    | `/transactions/:portfolioId`  | List a portfolio's transactions |

## Status

Work in progress.

- Working end to end: creating portfolios, logging buy/sell transactions, holdings and average buy price per asset.
- Not done yet: live prices and profit/loss (CoinMarketCap), the dashboard page, and the portfolio total.
