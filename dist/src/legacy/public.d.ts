import { Fetch } from "rpc-request";
export declare const ApiUri = "https://poloniex.com";
export declare const DefaultPair = "USDT_BTC";
export declare const ApiLimit = 100;
export declare const Headers: {
  "User-Agent": string;
};
export interface CurrencyPair {
  currencyPair?: string | undefined;
}
export interface BookFilter extends CurrencyPair {
  depth?: number | undefined;
}
export interface TradesFilter extends CurrencyPair {
  start?: number | undefined;
  end?: number | undefined;
}
export interface TimeFilter {
  start: number;
  end: number;
}
export type Period = 300 | 900 | 1800 | 7200 | 14400 | 86400;
export interface ChartFilter extends CurrencyPair {
  period: Period;
  start: number;
  end: number;
}
export interface CurrencyFilter {
  currency: string;
}
export interface TickerInfo {
  id: number;
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
  isFrozen: string | 0 | 1;
  high24hr: string;
  low24hr: string;
}
export type Tickers = Record<string, TickerInfo>;
export type Volume = Record<string, string>;
export type Volumes = Record<string, Volume | string>;
export interface OrderBookInfo {
  asks: [string, number][];
  bids: [string, number][];
  isFrozen: string;
  seq: number;
}
export type OrderBooksInfo = Record<string, OrderBookInfo>;
export type OrderBook = OrderBookInfo | OrderBooksInfo;
export type Side = "buy" | "sell";
export interface BaseTrade {
  type: Side;
  amount: string;
  date: string;
  rate: string;
  total: string;
  tradeID: number | string;
}
export interface Trade extends BaseTrade {
  globalTradeID: number;
  orderNumber: number | string;
}
export interface Candle {
  date: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  quoteVolume: number;
  weightedAverage: number;
}
export interface CurrencyInfo {
  id: number;
  name: string;
  humanType: string;
  currencyType: string;
  txFee: string;
  minConf: number;
  depositAddress: string | null;
  disabled: 0 | 1;
  delisted: 0 | 1;
  frozen: 0 | 1;
  hexColor: string;
  blockchain: string | null;
  isGeofenced: 0 | 1;
}
export interface ExtendedCurrencyInfo extends CurrencyInfo {
  parentChain: string | null;
  isMultiChain: 0 | 1;
  isChildChain: 0 | 1;
  childChains: string[];
}
export type ICurrencies = Record<string, CurrencyInfo>;
export type ExtendedCurrencies = Record<string, ExtendedCurrencyInfo>;
export interface Loan {
  rate: string;
  amount: string;
  rangeMin: number;
  rangeMax: number;
}
export interface Loans {
  offers: Loan[];
  demands: Loan[];
}
export declare class PublicClient extends Fetch {
  readonly currencyPair: string;
  constructor({ currencyPair }?: CurrencyPair);
  get<T = unknown>(url: string): Promise<T>;
  /** Retrieves summary information for each currency pair listed on the exchange. */
  getTickers(): Promise<Tickers>;
  /** Retrieves the 24-hour volume for all markets as well as totals for primary currencies. */
  getVolume(): Promise<Volumes>;
  /** Get the order book for a given market. */
  getOrderBook({ currencyPair, depth }?: BookFilter): Promise<OrderBook>;
  /** Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`. */
  getTradeHistory({ currencyPair, ...rest }?: TradesFilter): Promise<Trade[]>;
  /** Get candlestick chart data. */
  getChartData({ currencyPair, ...rest }: ChartFilter): Promise<Candle[]>;
  /** Get information about currencies. */
  getCurrencies(params: {
    includeMultiChainCurrencies: true;
  }): Promise<ExtendedCurrencies>;
  getCurrencies(params?: {
    includeMultiChainCurrencies?: boolean;
  }): Promise<ICurrencies>;
  /**  Get the list of loan offers and demands for a given currency. */
  getLoanOrders(qs: CurrencyFilter): Promise<Loans>;
  protected static addOptions(
    target: URL | URLSearchParams,
    data: Record<string, boolean | number | string | undefined>
  ): void;
}
