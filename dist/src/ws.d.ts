/// <reference types="node" />
import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
import {
  ISide,
  IOrderType,
  IAccountType,
  IOrderSource,
  IMatchRole,
  IOrderState,
} from "./auth.js";
export declare class WSAbort extends Error {
  constructor(msg: string);
}
export declare const WebSocketURL = "wss://ws.poloniex.com/ws/";
export type IWSType = "private" | "public";
interface ISignal {
  signal?: AbortSignal | null | undefined;
}
interface IEvent {
  event: string;
}
interface IBaseAuthMessage {
  data: {
    success: boolean;
    ts: number;
    message?: string;
  };
  channel: "auth";
}
export interface IFailedAuth extends IBaseAuthMessage {
  data: IBaseAuthMessage["data"] & {
    success: false;
    message: string;
  };
}
export interface ISuccessAuth extends IBaseAuthMessage {
  data: IBaseAuthMessage["data"] & {
    success: true;
  };
}
export interface IPong extends IEvent {
  event: "pong";
}
export type ICandlesChannel =
  | "candles_day_1"
  | "candles_day_3"
  | "candles_hour_1"
  | "candles_hour_2"
  | "candles_hour_4"
  | "candles_hour_6"
  | "candles_hour_12"
  | "candles_minute_1"
  | "candles_minute_5"
  | "candles_minute_10"
  | "candles_minute_15"
  | "candles_minute_30"
  | "candles_month_1"
  | "candles_week_1";
interface ISymbols extends ISignal {
  symbols?: string[] | string | undefined;
}
interface IBookOptions extends ISymbols {
  depth?: 5 | 10 | 20;
}
interface ISubscribeCandlesOptions extends ISymbols {
  channel: ICandlesChannel;
}
export type IPublicChannel =
  | ICandlesChannel
  | "book_lv2"
  | "book"
  | "ticker"
  | "trades";
export type IPrivateChannel = "auth" | "balances" | "orders";
export type IChannel = IPrivateChannel | IPublicChannel;
export interface ISubscribeEvent<T extends IChannel = IChannel> extends IEvent {
  event: "subscribe";
  channel: T;
  symbols?: string[];
}
export interface IUnsubscribeEvent<T extends IChannel = IChannel>
  extends IEvent {
  event: "unsubscribe";
  channel: T;
}
export interface IUnsubscribeAll extends IEvent {
  event: "unsubscribe_all";
  channel: "all";
}
export interface ISubscriptions {
  subscriptions: IChannel[];
}
export interface IErrorMessage extends IEvent {
  message: string;
}
export interface IWSCandle {
  channel: ICandlesChannel;
  data: [
    {
      symbol: string;
      amount: string;
      high: string;
      quantity: string;
      tradeCount: number;
      low: string;
      closeTime: number;
      startTime: number;
      close: string;
      open: string;
      ts: number;
    }
  ];
}
export interface IWSTrade {
  channel: "trades";
  data: [
    {
      symbol: string;
      amount: string;
      takerSide: Lowercase<ISide>;
      quantity: string;
      createTime: number;
      price: string;
      id: number;
      ts: number;
    }
  ];
}
export interface IWSTicker {
  channel: "ticker";
  data: [
    {
      symbol: string;
      dailyChange: string;
      high: string;
      amount: string;
      quantity: string;
      tradeCount: number;
      low: string;
      closeTime: number;
      startTime: number;
      close: string;
      open: string;
      ts: number;
      markPrice: string;
    }
  ];
}
export interface IBookData {
  symbol: string;
  createTime: number;
  asks: [string, string][];
  bids: [string, string][];
  id: number;
  ts: number;
}
export interface IBook {
  channel: "book";
  data: [
    {
      symbol: string;
      createTime: number;
      asks: [string, string][];
      bids: [string, string][];
      id: number;
      ts: number;
    }
  ];
}
interface IBookUpdate {
  symbol: string;
  asks: [string, string][];
  bids: [string, string][];
  createTime: number;
  lastId: number;
  id: number;
  ts: number;
}
export interface IBookLv2Snapshot {
  channel: "book_lv2";
  action: "snapshot";
  data: [IBookUpdate];
}
export interface IBookLv2Update extends Omit<IBookLv2Snapshot, "action"> {
  action: "update";
}
export type IBookLv2 = IBookLv2Snapshot | IBookLv2Update;
export type IPublicMessage =
  | IBook
  | IBookLv2Snapshot
  | IBookLv2Update
  | ISubscriptions
  | IUnsubscribeAll
  | IWSCandle
  | IWSTicker
  | IWSTrade;
export type IOrderEventType = "canceled" | "place" | "trade";
export interface IWSOrder {
  channel: "orders";
  data: [
    {
      symbol: string;
      type: IOrderType;
      quantity: string;
      orderId: string;
      tradeFee: string;
      clientOrderId: string;
      accountType: IAccountType;
      feeCurrency: string;
      eventType: IOrderEventType;
      source: IOrderSource;
      side: ISide;
      filledQuantity: string;
      filledAmount: string;
      matchRole: IMatchRole | "";
      state: IOrderState;
      tradeTime: number;
      tradeAmount: string;
      orderAmount: string;
      createTime: number;
      price: string;
      tradeQty: string;
      tradePrice: string;
      tradeId: string;
      ts: number;
    }
  ];
}
type IBalanceEventType =
  | "canceled_order"
  | "deposit"
  | "match_order"
  | "place_order"
  | "transfer_in"
  | "transfer_out"
  | "withdraw";
export interface IWSBalance {
  channel: "balances";
  data: [
    {
      changeTime: number;
      accountId: string;
      accountType: IAccountType;
      eventType: IBalanceEventType;
      available: string;
      currency: string;
      id: number;
      userId: number;
      hold: string;
      ts: number;
    }
  ];
}
export type IPrivateMessage =
  | IFailedAuth
  | ISuccessAuth
  | IWSBalance
  | IWSOrder;
export type IMessage =
  | IPong
  | IPrivateMessage
  | IPublicMessage
  | ISubscribeEvent
  | IUnsubscribeEvent;
export interface IWebSocketClientOptions {
  ws_url?: URL | string | undefined;
  symbol?: string | undefined;
  key?: string | undefined;
  secret?: string | undefined;
  signTimestamp?: () => string;
}
export interface WebSocketClient {
  addListener(
    event: "close" | "open",
    eventListener: (type: IWSType) => void
  ): this;
  addListener(
    event: "error",
    eventListener: (error: unknown, type: IWSType) => void
  ): this;
  addListener(
    event: "message",
    eventListener: (message: IMessage, type: IWSType) => void
  ): this;
  emit(event: "close" | "open", type: IWSType): boolean;
  emit(event: "error", error: unknown, type: IWSType): boolean;
  emit(event: "message", message: IMessage, type: IWSType): boolean;
  on(event: "close" | "open", eventListener: (type: IWSType) => void): this;
  on(
    event: "error",
    eventListener: (error: unknown, type: IWSType) => void
  ): this;
  on(
    event: "message",
    eventListener: (message: IMessage, type: IWSType) => void
  ): this;
  once(event: "close" | "open", eventListener: (type: IWSType) => void): this;
  once(
    event: "error",
    eventListener: (error: unknown, type: IWSType) => void
  ): this;
  once(
    event: "message",
    eventListener: (message: IMessage, type: IWSType) => void
  ): this;
  prependListener(
    event: "close" | "open",
    eventListener: (type: IWSType) => void
  ): this;
  prependListener(
    event: "error",
    eventListener: (error: unknown, type: IWSType) => void
  ): this;
  prependListener(
    event: "message",
    eventListener: (message: IMessage, type: IWSType) => void
  ): this;
  prependOnceListener(
    event: "close" | "open",
    eventListener: (type: IWSType) => void
  ): this;
  prependOnceListener(
    event: "error",
    eventListener: (error: unknown, type: IWSType) => void
  ): this;
  prependOnceListener(
    event: "message",
    eventListener: (message: IMessage, type: IWSType) => void
  ): this;
}
export declare class WebSocketClient extends EventEmitter {
  #private;
  /** Create WebSocketClient. */
  constructor({
    ws_url,
    symbol,
    signTimestamp,
    key,
    secret,
  }?: IWebSocketClientOptions);
  get symbol(): string;
  /** Public WebSocket */
  get public_ws(): WebSocket | null;
  /** Private WebSocket */
  get private_ws(): WebSocket | null;
  /** Connect to the public websocket. */
  connectPublicWS(): Promise<void>;
  /** Connect to the private websocket. */
  connectPrivateWS(): Promise<void>;
  /** Disconnect from the public websocket. */
  disconnectPublicWS(): Promise<void>;
  /** Disconnect from the private websocket. */
  disconnectPrivateWS(): Promise<void>;
  /** Send a ping message to the public server. */
  pingPublic({ signal }?: ISignal): Promise<IPong>;
  /** Send a ping message to the private server. */
  pingPrivate({ signal }?: ISignal): Promise<IPong>;
  /** Unsubscribe from all public channels. */
  unsubscribePublic({ signal }?: ISignal): Promise<IUnsubscribeAll>;
  /** Unsubscribe from all public channels. */
  unsubscribePrivate({ signal }?: ISignal): Promise<IUnsubscribeAll>;
  /** Get the list of current public subscriptions. */
  getPublicSubscriptions({ signal }?: ISignal): Promise<ISubscriptions>;
  /** Get the list of current private subscriptions. */
  getPrivateSubscriptions({ signal }?: ISignal): Promise<ISubscriptions>;
  /** Subscribe to the `channel` (candles). */
  subscribeCandles({
    channel,
    signal,
    symbols,
  }: ISubscribeCandlesOptions): Promise<ISubscribeEvent<ICandlesChannel>>;
  /** Unsubscribe from the `channel` (candles). */
  unsubscribeCandles({
    channel,
    signal,
    symbols,
  }: ISubscribeCandlesOptions): Promise<IUnsubscribeEvent<ICandlesChannel>>;
  /** Subscribe to the `trades` channel. */
  subscribeTrades({
    signal,
    symbols,
  }?: ISymbols): Promise<ISubscribeEvent<"trades">>;
  /** Unsubscribe from the `trades` channel. */
  unsubscribeTrades({
    signal,
    symbols,
  }?: ISymbols): Promise<IUnsubscribeEvent<"trades">>;
  /** Subscribe to the `ticker` channel. */
  subscribeTicker({
    signal,
    symbols,
  }?: ISymbols): Promise<ISubscribeEvent<"ticker">>;
  /** Unsubscribe from the `ticker` channel. */
  unsubscribeTicker({
    signal,
    symbols,
  }?: ISymbols): Promise<IUnsubscribeEvent<"ticker">>;
  /** Subscribe to the `book` channel. */
  subscribeBook({
    signal,
    symbols,
    depth,
  }?: IBookOptions): Promise<ISubscribeEvent<"book">>;
  /** Unsubscribe from the `book` channel. */
  unsubscribeBook({
    signal,
    symbols,
  }?: IBookOptions): Promise<IUnsubscribeEvent<"book">>;
  /** Subscribe to the `book_lv2` channel. */
  subscribeLv2Book({
    signal,
    symbols,
  }?: ISymbols): Promise<ISubscribeEvent<"book_lv2">>;
  /** Unsubscribe from the `book_lv2` channel. */
  unsubscribeLv2Book({
    signal,
    symbols,
  }?: ISymbols): Promise<IUnsubscribeEvent<"book_lv2">>;
  /** Authenticate to the private websocket. */
  auth({ signal }?: ISignal): Promise<ISuccessAuth>;
  /** Subscribe to the `orders` channel. */
  subscribeOrders({
    signal,
    symbols,
  }?: ISymbols): Promise<ISubscribeEvent<"orders">>;
  /** Unsubscribe from the `orders` channel. */
  unsubscribeOrders({
    signal,
    symbols,
  }?: ISymbols): Promise<IUnsubscribeEvent<"orders">>;
  /** Subscribe to the `balances` channel. */
  subscribeBalances({
    signal,
  }?: ISymbols): Promise<ISubscribeEvent<"balances">>;
  /** Unsubscribe from the `balances` channel. */
  unsubscribeBalances({
    signal,
  }?: ISymbols): Promise<IUnsubscribeEvent<"balances">>;
  candles({
    channel,
    signal,
    symbols,
  }: ISubscribeCandlesOptions): AsyncGenerator<IWSCandle>;
  trades({ signal, symbols }?: ISymbols): AsyncGenerator<IWSTrade>;
  tickers({ signal, symbols }?: ISymbols): AsyncGenerator<IWSTicker>;
  books({ signal, symbols, depth }?: IBookOptions): AsyncGenerator<IBook>;
  booksLv2({ signal, symbols }?: IBookOptions): AsyncGenerator<IBookLv2>;
  orders({ signal, symbols }?: ISymbols): AsyncGenerator<IWSOrder>;
  balances({ signal }?: ISymbols): AsyncGenerator<IWSBalance>;
  /** Send a message to the WebSocket server */
  send(payload: Record<string, unknown>, type: IWSType): Promise<void>;
}
export {};
