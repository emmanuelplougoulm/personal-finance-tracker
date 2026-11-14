# Personal Finance Tracker

A personal finance app, built as a side project. Its first feature is a crypto portfolio tracker: create portfolios, log buy/sell transactions, and see your holdings and average buy price per asset.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Monorepo | Turborepo, pnpm workspaces                               |
| Frontend | Nuxt 3, Vue 3 (Composition API), Pinia, TypeScript       |
| Backend  | NestJS, Mongoose, Swagger, Winston                       |
| Database | MongoDB                                                  |
| Data     | CoinMarketCap API (coin listings)                        |
| Tooling  | ESLint (shared config package), Prettier, Husky          |

## Repository layout

```
apps/
  web/                    Nuxt 3 front end (dashboard, portfolio views)
  api/                    NestJS REST API (portfolios, transactions)
packages/
  eslint-config-custom/   ESLint config shared across the workspace
```

## Getting started

### Prerequisites

- Node.js 18+
- pnpm 8 (`corepack enable` picks up the version pinned in `package.json`)
- A MongoDB instance (local or Atlas)
- A CoinMarketCap API key (free tier is enough)

### Install

```bash
pnpm install
```

### Configure

The API reads its configuration from environment variables:

| Variable          | Description                     |
| ----------------- | ------------------------------- |
| `MONGO_URI`       | MongoDB connection string       |
| `CMC_PRO_API_KEY` | CoinMarketCap API key           |

```bash
export MONGO_URI="mongodb://localhost:27017/personal-finance-tracker"
export CMC_PRO_API_KEY="<your-key>"
```

### Run

```bash
pnpm dev
```

Turborepo starts both apps in parallel:

- Web app: http://localhost:3000
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

Work in progress. The portfolio and transaction flows work end to end; the dashboard UI is still being polished.
