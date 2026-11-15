# Personal Finance Tracker

[![CI](https://github.com/emmanuelplougoulm/personal-finance-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/emmanuelplougoulm/personal-finance-tracker/actions/workflows/ci.yml)

A personal finance app, built as a side project. Its first feature is a crypto portfolio tracker: create portfolios, log buy/sell transactions, and see your holdings and average buy price per asset.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Monorepo | Turborepo 2, pnpm workspaces                             |
| Frontend | Nuxt 4, Vue 3 (Composition API), Pinia, TypeScript       |
| Backend  | NestJS 12, Mongoose 9, Swagger, Winston                  |
| Database | MongoDB                                                  |
| Data     | Static coin list (CoinMarketCap integration in progress) |
| Tooling  | ESLint 10 (flat config), Prettier, Vitest                |

## Repository layout

```
apps/
  web/    Nuxt 4 front end (portfolio view, dashboard placeholder)
  api/    NestJS REST API (portfolios, transactions)
eslint.config.js          ESLint config for the whole workspace
```

## Getting started

### Prerequisites

- Node.js 24+
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

### Test

```bash
pnpm test
```

Runs the Vitest suites: unit tests for the portfolio calculations, and API tests that exercise the NestJS endpoints with supertest against an in-memory MongoDB (no local database needed). `pnpm lint` runs ESLint on the whole workspace. GitHub Actions runs lint, tests and build on every push and pull request.

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

- Working end to end: creating portfolios, logging buy/sell transactions, and per asset: holdings, quantity-weighted average buy price and amount invested (fees included). The portfolio header shows the total invested.
- Not done yet: live prices, current value and profit/loss (CoinMarketCap), and the dashboard page.
