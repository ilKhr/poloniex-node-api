/// <reference types="node" />
import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
export declare const WsUri = "wss://api2.poloniex.com";
export declare const DefaultChannels: number[];
export type Channel = number | string;
export interface Subscription {
  command: "subscribe" | "unsubscribe";
  channel: Channel;
}
export interface RawError {
  error: string;
}
export type RawWsHeartbeat = [1010];
export type RawAcknowledgement = [Channel, 0 | 1];
export type RawTickerMessage = [
  1002,
  null,
  [
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    0 | 1,
    string,
    string
  ]
];
export type RawVolumeMessage = [
  1003,
  null,
  [string, number, Record<string, string>]
];
export type RawSnapshot = [
  "i",
  {
    currencyPair: string;
    orderBook: [Record<string, string>, Record<string, string>];
  },
  string
];
export type RawPublicTrade = [
  "t",
  string,
  0 | 1,
  string,
  string,
  number,
  string
];
export type RawBookUpdate = ["o", 0 | 1, string, string, string];
export type RawPriceAggregatedBook = [
  Channel,
  number,
  (RawBookUpdate | RawPublicTrade | RawSnapshot)[]
];
export type RawPendingOrder = [
  "p",
  number,
  number,
  string,
  string,
  string,
  string | null,
  string
];
export type RawNewOrder = [
  "n",
  number,
  number,
  string,
  string,
  string,
  string,
  string,
  string | null
];
export type RawBalance = ["b", number, "e" | "l" | "m", string];
export type RawOrder = ["o", number, string, "c" | "f" | "s", string | null];
export type RawMarginUpdate = ["m", number, number, string, string | null];
export type RawTrade = [
  "t",
  number,
  string,
  string,
  string,
  0 | 1 | 2 | 3,
  number,
  string,
  string,
  string | null,
  string,
  string
];
export type RawKill = ["k", number, string | null];
export type RawAccountMessage = [
  1000,
  "",
  (
    | RawBalance
    | RawKill
    | RawMarginUpdate
    | RawNewOrder
    | RawOrder
    | RawPendingOrder
    | RawTrade
  )[]
];
export type RawMessage =
  | RawAccountMessage
  | RawAcknowledgement
  | RawError
  | RawPriceAggregatedBook
  | RawTickerMessage
  | RawVolumeMessage
  | RawWsHeartbeat;
export interface BaseMessage {
  channel_id: Channel;
  subject: string;
  sequence?: number | string | null;
}
export interface WsHeartbeat extends BaseMessage {
  channel_id: 1010;
  subject: "heartbeat";
}
export interface WsAcknowledgement extends BaseMessage {
  subject: "subscribed" | "unsubscribed";
}
export interface WsTicker extends BaseMessage {
  subject: "ticker";
  channel_id: 1002;
  currencyPairId: number;
  currencyPair?: string | undefined;
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
  isFrozen: boolean;
  high24hr: string;
  low24hr: string;
}
export interface WsVolume extends BaseMessage {
  subject: "volume";
  channel_id: 1003;
  time: string;
  users: number;
  volume: Record<string, string>;
}
export interface WsSnapshot {
  subject: "snapshot";
  currencyPair: string;
  asks: Record<string, string>;
  bids: Record<string, string>;
  epoch_ms: string;
}
export interface WsPublicTrade {
  subject: "publicTrade";
  tradeID: string;
  type: "buy" | "sell";
  price: string;
  size: string;
  timestamp: number;
  epoch_ms: string;
}
export interface WsBookUpdate {
  subject: "update";
  type: "ask" | "bid";
  price: string;
  size: string;
  epoch_ms: string;
}
export type WsBookMessage = BaseMessage & {
  sequence: number;
  currencyPair?: string | undefined;
} & (WsBookUpdate | WsPublicTrade | WsSnapshot);
export interface WsPendingOrder {
  subject: "pending";
  orderNumber: number;
  currencyPairId: number;
  currencyPair?: string | undefined;
  rate: string;
  amount: string;
  type: "buy" | "sell";
  clientOrderId: string | null;
  epoch_ms: string;
}
export interface WsNewOrder {
  subject: "new";
  currencyPairId: number;
  currencyPair?: string | undefined;
  orderNumber: number;
  type: "buy" | "sell";
  rate: string;
  amount: string;
  date: string;
  originalAmount: string;
  clientOrderId: string | null;
}
export interface WsBalance {
  subject: "balance";
  currencyId: number;
  currency?: string | undefined;
  wallet: "exchange" | "lending" | "margin";
  amount: string;
}
export interface WsOrder {
  subject: "order";
  orderNumber: number;
  newAmount: string;
  orderType: "canceled" | "filled" | "self-trade";
  clientOrderId: string | null;
}
export interface WsMarginUpdate {
  subject: "margin";
  orderNumber: number;
  currency: string;
  amount: string;
  clientOrderId?: string | null;
}
export interface WsTrade {
  subject: "trade";
  tradeID: number;
  rate: string;
  amount: string;
  feeMultiplier: string;
  fundingType: 0 | 1 | 2 | 3;
  orderNumber: number;
  fee: string;
  date: string;
  clientOrderId: string | null;
  total_trade: string;
  epoch_ms: string;
}
export interface WsKill {
  subject: "killed";
  orderNumber: number;
  clientOrderId: string | null;
}
export type WsAccountMessage = BaseMessage &
  (
    | WsBalance
    | WsKill
    | WsMarginUpdate
    | WsNewOrder
    | WsOrder
    | WsPendingOrder
    | WsTrade
  );
export type WsMessage =
  | WsAccountMessage
  | WsAcknowledgement
  | WsBookMessage
  | WsHeartbeat
  | WsTicker
  | WsVolume;
export interface WebSocketClientOptions {
  wsUri?: string;
  raw?: boolean;
  channels?: Channel[];
  key?: string;
  secret?: string;
}
export declare interface WebSocketClient {
  on: ((event: "close" | "open", eventListener: () => void) => this) &
    ((event: "error", eventListener: (error: unknown) => void) => this) &
    ((event: "message", eventListener: (data: WsMessage) => void) => this) &
    ((event: "rawMessage", eventListener: (data: RawMessage) => void) => this);
  once: ((event: "close" | "open", eventListener: () => void) => this) &
    ((event: "error", eventListener: (error: unknown) => void) => this) &
    ((event: "message", eventListener: (data: WsMessage) => void) => this) &
    ((event: "rawMessage", eventListener: (data: RawMessage) => void) => this);
}
export declare class WebSocketClient extends EventEmitter {
  #private;
  ws?: WebSocket;
  readonly raw: boolean;
  readonly channels: Channel[];
  readonly wsUri: string;
  /** Create WebSocketClient. */
  constructor({ wsUri, raw, channels, key, secret }?: WebSocketClientOptions);
  /** Connect to the websocket. */
  connect(): Promise<void>;
  /** Disconnect from the websocket. */
  disconnect(): Promise<void>;
  /** Subscribes to the specified channel. */
  subscribe(channel: Channel): Promise<void>;
  /** Unsubscribes from the specified channel. */
  unsubscribe(channel: Channel): Promise<void>;
  static formatTicker([
    channel_id,
    ,
    [
      currencyPairId,
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen,
      high24hr,
      low24hr,
    ],
  ]: RawTickerMessage): WsTicker;
  static formatVolume([
    channel_id,
    ,
    [time, users, volume],
  ]: RawVolumeMessage): WsVolume;
  static formatSnapshot([
    ,
    { currencyPair, orderBook },
    epoch_ms,
  ]: RawSnapshot): WsSnapshot;
  static formatPublicTrade([
    ,
    tradeID,
    side,
    price,
    size,
    timestamp,
    epoch_ms,
  ]: RawPublicTrade): WsPublicTrade;
  static formatBookUpdate([
    ,
    side,
    price,
    size,
    epoch_ms,
  ]: RawBookUpdate): WsBookUpdate;
  static formatHeartbeat([channel_id]: RawWsHeartbeat): WsHeartbeat;
  static formatAcknowledge([
    channel_id,
    sequence,
  ]: RawAcknowledgement): WsAcknowledgement;
  static formatUpdate([
    channel_id,
    sequence,
    messages,
  ]: RawPriceAggregatedBook): WsBookMessage[];
  static formatPending([
    ,
    orderNumber,
    currencyPairId,
    rate,
    amount,
    type,
    clientOrderId,
    epoch_ms,
  ]: RawPendingOrder): WsPendingOrder;
  static formatNew([
    ,
    currencyPairId,
    orderNumber,
    type,
    rate,
    amount,
    date,
    originalAmount,
    clientOrderId,
  ]: RawNewOrder): WsNewOrder;
  static formatBalance([, currencyId, w, amount]: RawBalance): WsBalance;
  static formatOrder([
    ,
    orderNumber,
    newAmount,
    t,
    clientOrderId,
  ]: RawOrder): WsOrder;
  static formatMarginUpdate([
    ,
    orderNumber,
    currency,
    amount,
    clientOrderId,
  ]: RawMarginUpdate): WsMarginUpdate;
  static formatTrade([
    ,
    tradeID,
    rate,
    amount,
    feeMultiplier,
    fundingType,
    orderNumber,
    fee,
    date,
    clientOrderId,
    total_trade,
    epoch_ms,
  ]: RawTrade): WsTrade;
  static formatKill([, orderNumber, clientOrderId]: RawKill): WsKill;
  static formatAccount([
    channel_id,
    ,
    messages,
  ]: RawAccountMessage): WsAccountMessage[];
  set nonce(nonce: () => number);
  get nonce(): () => number;
}
