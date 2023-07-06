import { Fetch, IFetchOptions } from "rpc-request";
export type IRecordType = Record<
  string,
  string[] | boolean | number | string | undefined
>;
export interface IPoloniexGetOptions extends IPoloniexFetchOptions {
  options?: IRecordType;
}
export interface IPoloniexFetchOptions extends IFetchOptions {
  options?: IRecordType | unknown[];
}
export declare const ApiUrl = "https://api.poloniex.com/";
export declare const DefaultSymbol = "BTC_USDT";
export interface IOrderBookOptions {
  symbol?: string;
  scale?: number;
  limit?: 5 | 10 | 20 | 50 | 100 | 150;
}
export interface ICandlesOptions {
  symbol?: string;
  interval:
    | "DAY_1"
    | "DAY_3"
    | "HOUR_1"
    | "HOUR_2"
    | "HOUR_4"
    | "HOUR_6"
    | "HOUR_12"
    | "MINUTE_1"
    | "MINUTE_5"
    | "MINUTE_10"
    | "MINUTE_15"
    | "MINUTE_30"
    | "MONTH_1"
    | "WEEK_1";
  limit?: number;
  startTime?: number;
  endTime?: number;
}
export interface IPublicTradeOptions {
  symbol?: string;
  limit?: number;
}
/** Reference Data */
export interface ISymbolInformation {
  symbol: string;
  baseCurrencyName: string;
  quoteCurrencyName: string;
  displayName: string;
  state: string;
  visibleStartTime: number;
  tradableStartTime: number;
  symbolTradeLimit: {
    symbol: string;
    priceScale: number;
    quantityScale: number;
    amountScale: number;
    minQuantity: string;
    minAmount: string;
    highestBid: string;
    lowestAsk: string;
  };
  crossMargin: {
    supportCrossMargin: boolean;
    maxLeverage: number;
  };
}
export interface ICurrency {
  currency: string;
  id: number;
  name: string;
  description: string;
  type: string;
  withdrawalFee: string;
  minConf: number;
  depositAddress: null;
  blockchain: string;
  delisted: boolean;
  tradingState: "NORMAL" | "OFFLINE";
  walletState: "DISABLED" | "ENABLED";
  supportCollateral: boolean;
  supportBorrow: boolean;
}
export interface IExtendedCurrency extends ICurrency {
  parentChain: string | null;
  isMultiChain: boolean;
  isChildChain: boolean;
  childChains: string[];
}
export interface ISystemTimestamp {
  serverTime: number;
}
export interface IPrice {
  symbol: string;
  price: string;
  time: number;
  dailyChange: string;
  ts: number;
}
export interface IMarkPrice {
  symbol: string;
  markPrice: string;
  time: number;
}
export interface IMarkPriceComponents extends Omit<IMarkPrice, "time"> {
  ts: number;
  components: {
    symbol: string;
    symbolPrice: string;
    weight: string;
    convertPrice: string;
    exchange: string;
  }[];
}
export interface IOrderBook {
  time: number;
  scale: string;
  asks: string[];
  bids: string[];
  ts: number;
}
export type IRawCandle = [
  low: string,
  high: string,
  open: string,
  close: string,
  amount: string,
  quantity: string,
  buyTakerAmount: string,
  buyTakerQuantity: string,
  tradeCount: number,
  ts: number,
  weightedAverage: string,
  interval: ICandlesOptions["interval"],
  startTime: number,
  closeTime: number
];
export interface ICandle {
  low: string;
  high: string;
  open: string;
  close: string;
  amount: string;
  quantity: string;
  buyTakerAmount: string;
  buyTakerQuantity: string;
  tradeCount: number;
  ts: number;
  weightedAverage: string;
  interval: ICandlesOptions["interval"];
  startTime: number;
  closeTime: number;
}
export interface IPublicTrade {
  id: string;
  price: string;
  quantity: string;
  amount: string;
  takerSide: "BUY" | "SELL";
  ts: number;
  createTime: number;
}
export interface ITicker {
  symbol: string;
  open: string;
  low: string;
  high: string;
  close: string;
  quantity: string;
  amount: string;
  tradeCount: number;
  startTime: number;
  closeTime: number;
  displayName: string;
  dailyChange: string;
  bid: string;
  bidQuantity: string;
  ask: string;
  askQuantity: string;
  ts: number;
  markPrice: string;
}
export interface ICollateral {
  currency: string;
  collateralRate: string;
  initialMarginRate: string;
  maintenanceMarginRate: string;
}
export interface IBorrowRate {
  tier: string;
  rates: {
    currency: string;
    dailyBorrowRate: string;
    hourlyBorrowRate: string;
    borrowLimit: string;
  }[];
}
export interface IPublicClientOptions {
  url?: URL | string | undefined;
  symbol?: string;
}
export declare class PublicClient extends Fetch {
  #private;
  constructor({ url, symbol }?: IPublicClientOptions);
  get base_url(): URL;
  get symbol(): string;
  get<T = unknown>(
    path?: string,
    {
      options,
      ...init
    }?: Exclude<
      IPoloniexGetOptions,
      {
        options: unknown[];
      }
    >
  ): Promise<T>;
  /** Get all symbols and their trade limit info. */
  getMarkets(): Promise<ISymbolInformation[]>;
  /** Get a single symbol and its trade limit info. */
  getMarket({
    symbol,
  }?: {
    symbol?: string | undefined;
  }): Promise<[ISymbolInformation]>;
  /** Get data for a supported currency all supported currencies. */
  getCurrency(query: {
    includeMultiChainCurrencies: true;
    currency: string;
  }): Promise<IExtendedCurrency>;
  getCurrency(query: {
    includeMultiChainCurrencies: true;
    currency?: undefined;
  }): Promise<IExtendedCurrency[]>;
  getCurrency(query: {
    includeMultiChainCurrencies?: false | undefined;
    currency: string;
  }): Promise<ICurrency>;
  getCurrency(query?: {
    includeMultiChainCurrencies?: false | undefined;
    currency?: string | undefined;
  }): Promise<ICurrency[]>;
  /** Get current server time. */
  getSystemTime(): Promise<ISystemTimestamp>;
  /** Get the latest trade price for all symbols. */
  getPrices(): Promise<IPrice[]>;
  /** Get the latest trade price for a symbol. */
  getPrice({ symbol }?: { symbol?: string | undefined }): Promise<IPrice>;
  /** Get latest mark price for all cross margin symbols. */
  getMarkPrices(): Promise<IMarkPrice[]>;
  /** Get latest mark price for a single cross margin symbol. */
  getMarkPrice({
    symbol,
  }?: {
    symbol?: string | undefined;
  }): Promise<IMarkPrice>;
  /** Get components of the mark price for a given symbol. */
  getMarkPriceComponents({
    symbol,
  }?: {
    symbol?: string | undefined;
  }): Promise<IMarkPriceComponents>;
  /** Get the order book for a given symbol. */
  getOrderBook({ symbol, ...options }?: IOrderBookOptions): Promise<IOrderBook>;
  /** Get OHLC for a symbol at given timeframe (interval). */
  getCandles({ symbol, ...options }: ICandlesOptions): Promise<ICandle[]>;
  /** Get a list of recent trades. */
  getPublicTrades({
    symbol,
    ...options
  }?: IPublicTradeOptions): Promise<IPublicTrade[]>;
  /** Get ticker in last 24 hours for all symbols. */
  getTickers(): Promise<ITicker[]>;
  /** Get ticker in last 24 hours for a given symbol. */
  getTicker({ symbol }?: { symbol?: string | undefined }): Promise<ITicker>;
  /** Get collateral information for all currencies or a single currency.. */
  getCollateral(options: { currency: string }): Promise<ICollateral>;
  getCollateral(options?: { currency?: undefined }): Promise<ICollateral[]>;
  /** Get borrow rates information for all tiers and currencies. */
  getBorrowRates(): Promise<IBorrowRate[]>;
  static setQuery(query: URLSearchParams, object?: IRecordType): void;
}
