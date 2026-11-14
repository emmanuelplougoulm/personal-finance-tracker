export interface ITransaction {
  __v?: number;
  _id?: string;
  amount: number;
  asset: string;
  currency: string;
  date: string;
  fees?: number | null;
  portfolioId: string;
  price: number;
  transactionId: string;
  type: string;
}

const isBuy = (transaction: ITransaction) => transaction.type === 'BUY';
const toNumber = (value: unknown) => Number(value) || 0;

/** Units currently held: bought minus sold. */
export const calculateTokenHoldings = (transactions: ITransaction[]): number =>
  transactions.reduce(
    (sum, t) => (isBuy(t) ? sum + toNumber(t.amount) : sum - toNumber(t.amount)),
    0
  );

/**
 * Average buy price, weighted by the quantity of each buy (fees excluded).
 * Returns null when there is no buy.
 */
export const calculateAvgBuyPrice = (transactions: ITransaction[]): number | null => {
  const buys = transactions.filter(isBuy);
  const quantity = buys.reduce((sum, t) => sum + toNumber(t.amount), 0);
  if (quantity === 0) return null;

  const cost = buys.reduce((sum, t) => sum + toNumber(t.amount) * toNumber(t.price), 0);
  return cost / quantity;
};

/**
 * Amount invested in the units still held, fees included.
 * Uses the average cost method: each sale removes units at the average cost per unit.
 */
export const calculateInvested = (transactions: ITransaction[]): number => {
  const buys = transactions.filter(isBuy);
  const quantity = buys.reduce((sum, t) => sum + toNumber(t.amount), 0);
  if (quantity === 0) return 0;

  const cost = buys.reduce(
    (sum, t) => sum + toNumber(t.amount) * toNumber(t.price) + toNumber(t.fees),
    0
  );
  const holdings = Math.max(calculateTokenHoldings(transactions), 0);
  return (cost / quantity) * holdings;
};

export const formatAmount = (value: number | null): string =>
  value === null
    ? '—'
    : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Token quantity, up to 8 decimals, without floating-point noise. */
export const formatQuantity = (value: number): string =>
  value.toLocaleString('en-US', { maximumFractionDigits: 8 });
