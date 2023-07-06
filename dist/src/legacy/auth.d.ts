import {
  PublicClient,
  CurrencyFilter,
  TimeFilter,
  CurrencyPair,
  Side,
  TradesFilter,
  Trade,
  BaseTrade,
} from "./public.js";
export interface AccountFilter {
  account?: string | undefined;
}
export interface HistoryTradesFilter extends TradesFilter {
  limit?: number | undefined;
}
export interface OrderFilter {
  orderNumber: number;
}
export interface OrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  fillOrKill?: 0 | 1 | undefined;
  immediateOrCancel?: 0 | 1 | undefined;
  postOnly?: 0 | 1 | undefined;
  clientOrderId?: number | undefined;
}
export type ClientOrderFilter =
  | OrderFilter
  | {
      clientOrderId: number;
    };
export interface MoveOrderOptions extends OrderFilter {
  rate: number;
  amount?: number | undefined;
  postOnly?: 0 | 1 | undefined;
  immediateOrCancel?: 0 | 1 | undefined;
  clientOrderId?: number | undefined;
}
export interface WithdrawOptions {
  currency: string;
  amount: number;
  address: string;
  paymentId?: number | string | undefined;
}
export interface TransferOptions {
  currency: string;
  amount: number;
  fromAccount: "exchange" | "futures" | "lending" | "margin";
  toAccount: "exchange" | "futures" | "lending" | "margin";
}
export interface MarginOrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  lendingRate?: number | undefined;
  clientOrderId?: number | undefined;
}
export interface OfferOptions {
  currency: string;
  amount: number;
  duration: number;
  autoRenew: 0 | 1;
  lendingRate: number;
}
export interface LendingHistoryOptions {
  start?: number | undefined;
  end?: number | undefined;
  limit?: number | undefined;
}
export interface SwapCurrenciesOptions {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}
export type Balances = Record<string, string>;
export interface CompleteBalance {
  available: string;
  onOrders: string;
  btcValue: string;
}
export type CompleteBalances = Record<string, CompleteBalance>;
export type Adresses = Record<string, string>;
export interface NewAddress {
  success: 0 | 1;
  response: string;
}
export interface Adjustment {
  currency: string;
  amount: string;
  timestamp: number;
  status: string;
  category: "adjustment";
  adjustmentTitle: string;
  adjustmentDesc: string;
  adjustmentHelp: string;
}
export interface Withdrawal {
  withdrawalNumber: number;
  currency: string;
  address: string;
  amount: string;
  fee: string;
  timestamp: number;
  status: string;
  ipAddress: string;
  canCancel: 0 | 1;
  canResendEmail: 0 | 1;
  paymentID: string | null;
  fiatAccountId?: string | null;
  scope?: string | null;
}
export interface Deposit {
  currency: string;
  address: string;
  amount: string;
  confirmations: number;
  txid: string;
  timestamp: number;
  status: "COMPLETE" | "PENDING";
  depositNumber: number;
  category: "deposit";
  fiatAccountId?: string | null;
  scope?: string | null;
}
export interface DepositsWithdrawals {
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  adjustments: Adjustment[];
}
export interface Order {
  type: Side;
  orderNumber: string;
  rate: string;
  startingAmount: string;
  amount: string;
  total: string;
  date: string;
  margin: 0 | 1;
  clientOrderId?: string;
}
export type Orders = Order[] | Record<string, Order[]>;
export interface TradePrivate extends Trade {
  fee: string;
  category: "exchange" | "margin";
}
export type TradesPrivate = Record<string, TradePrivate[]> | TradePrivate[];
export interface OrderTrade extends BaseTrade {
  globalTradeID: number;
  currencyPair: string;
  fee: string;
}
export interface OrderStatus {
  result: Record<
    string,
    {
      currencyPair: string;
      rate: string;
      amount: string;
      total: string;
      startingAmount: string;
      type: "buy" | "sell";
      status: "Open" | "Partially filled";
      date: string;
      fee?: string;
    }
  >;
  success: 0 | 1;
}
export interface ResultingTrade extends BaseTrade {
  takerAdjustment?: string;
}
export interface OrderResult {
  orderNumber: string;
  resultingTrades: ResultingTrade[];
  tokenFee: number;
  tokenFeeCurrency: string | null;
  fee: string;
  currencyPair: string;
  clientOrderId?: string;
}
export interface CancelResponse {
  success: 0 | 1;
  amount: string;
  message: string;
  fee?: string;
  clientOrderId?: string;
  currencyPair?: string;
}
export interface CancelAllResponse {
  success: 0 | 1;
  message: string;
  orderNumbers: number[];
}
export interface MoveResponse {
  success: 0 | 1;
  orderNumber: string;
  fee: string;
  currencyPair: string;
  resultingTrades: Record<string, ResultingTrade[]>;
  clientOrderId?: string;
}
export interface WithdrawResponse {
  response: string;
  email2FA?: boolean;
  withdrawalNumber?: number;
}
export interface FeesInfo {
  makerFee: string;
  takerFee: string;
  marginMakerFee?: string;
  marginTakerFee?: string;
  thirtyDayVolume: string;
  nextTier: number;
}
export interface AccountBalances {
  exchange?: Balances | [];
  margin?: Balances | [];
  lending?: Balances | [];
}
export type TradableBalances = Record<string, Balances>;
export interface TransferResponse {
  success: 0 | 1;
  message: string;
}
export interface MarginSummary {
  totalValue: string;
  pl: string;
  lendingFees: string;
  netValue: string;
  totalBorrowedValue: string;
  currentMargin: string;
}
export interface MarginOrderResult extends OrderResult {
  message: string;
}
export interface MarginPosition {
  amount: string;
  total: string;
  basePrice: string;
  liquidationPrice: number;
  pl: string;
  lendingFees: string;
  type: "long" | "none" | "short";
}
export type MarginPositionResult =
  | MarginPosition
  | Record<string, MarginPosition>;
export interface ClosePositionResult {
  success: 0 | 1;
  message: string;
  resultingTrades: Record<string, ResultingTrade[]>;
}
export interface OfferResult {
  success: 0 | 1;
  message: string;
  orderID?: number;
}
export interface CancelLoanResponse {
  success: 0 | 1;
  message: string;
  amount?: string;
}
export interface LoanOffer {
  id: number;
  rate: string;
  amount: string;
  duration: number;
  autoRenew: 0 | 1;
  date: string;
}
export type LoanOffers = LoanOffer[] | Record<string, LoanOffer[]>;
export interface ActiveLoan {
  id: number;
  currency: string;
  rate: string;
  amount: string;
  range: number;
  autoRenew?: 0 | 1;
  date: string;
  fees: string;
}
export interface ActiveLoans {
  provided: ActiveLoan[];
  used: ActiveLoan[];
}
export interface LendingHistoryItem {
  id: number;
  currency: string;
  rate: string;
  amount: string;
  duration: string;
  interest: string;
  fee: string;
  earned: string;
  open: string;
  close: string;
}
export interface AutoRenewResult {
  success: 0 | 1;
  message: string | 0 | 1;
}
export interface SwapResult {
  success: boolean;
  message: string;
}
export interface AuthenticatedClientOptions extends CurrencyPair {
  key: string;
  secret: string;
}
export declare class AuthenticatedClient extends PublicClient {
  #private;
  constructor({ key, secret, ...rest }: AuthenticatedClientOptions);
  post<T = unknown>(
    url?: string,
    {
      body,
    }?: {
      body?: URLSearchParams;
    }
  ): Promise<T>;
  /** Get all of your balances available for trade after having deducted all open orders. */
  getBalances(): Promise<Balances>;
  /** Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance. */
  getCompleteBalances(form?: AccountFilter): Promise<CompleteBalances>;
  /** Get all of your deposit addresses. */
  getDepositAddresses(): Promise<Adresses>;
  /** Generate a new deposit address. */
  getNewAddress(form: CurrencyFilter): Promise<NewAddress>;
  /** Get your adjustment, deposit, and withdrawal history within a range window. */
  getDepositsWithdrawals(form: TimeFilter): Promise<DepositsWithdrawals>;
  /** Get your open orders for a given market. */
  getOpenOrders({ currencyPair }?: CurrencyPair): Promise<Orders>;
  /** Get your trade history for a given market. */
  getHistoryTrades({
    currencyPair,
    ...form
  }?: HistoryTradesFilter): Promise<TradesPrivate>;
  /** Get all trades involving a given order. */
  getOrderTrades(form: OrderFilter): Promise<OrderTrade[]>;
  /** Get the status of a given order. */
  getOrderStatus(form: OrderFilter): Promise<OrderStatus>;
  /** Places a limit buy order. */
  buy({ currencyPair, ...form }: OrderOptions): Promise<OrderResult>;
  /** Places a limit sell order. */
  sell({ currencyPair, ...form }: OrderOptions): Promise<OrderResult>;
  /** Cancel an order you have placed in a given market. */
  cancelOrder(form: ClientOrderFilter): Promise<CancelResponse>;
  /** Cancel all open orders in a given market or, if no market is provided, all open orders in all markets. */
  cancelAllOrders(form?: CurrencyPair): Promise<CancelAllResponse>;
  /** Cancels an order and places a new one of the same type in a single atomic transaction. */
  moveOrder(form: MoveOrderOptions): Promise<MoveResponse>;
  /** Immediately place a withdrawal for a given currency. */
  withdraw(form: WithdrawOptions): Promise<WithdrawResponse>;
  /** Get your current trading fees and trailing 30-day volume in BTC. */
  getFeeInfo(): Promise<FeesInfo>;
  /** Get your balances sorted by account. */
  getAccountBalances(form?: AccountFilter): Promise<AccountBalances>;
  /** Get your current tradable balances for each currency in each market for which margin trading is enabled. */
  getTradableBalances(): Promise<TradableBalances>;
  /** Transfer funds from one account to another. */
  transferBalance(form: TransferOptions): Promise<TransferResponse>;
  /** Get a summary of your entire margin account. */
  getMarginSummary(): Promise<MarginSummary>;
  /** Place a margin buy order in a given market. */
  marginBuy({
    currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult>;
  /** Place a margin sell order in a given market. */
  marginSell({
    currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult>;
  /** Get information about your margin position in a given market. */
  getMarginPosition({
    currencyPair,
  }?: CurrencyPair): Promise<MarginPositionResult>;
  /** Close your margin position in a given market using a market order. */
  closeMarginPosition({
    currencyPair,
  }?: CurrencyPair): Promise<ClosePositionResult>;
  /** Create a loan offer for a given currency. */
  createLoanOffer(form: OfferOptions): Promise<OfferResult>;
  /** Cancel a loan offer. */
  cancelLoanOffer(form: OrderFilter): Promise<CancelLoanResponse>;
  /** Get your open loan offers for each currency. */
  getOpenLoanOffers(): Promise<LoanOffers>;
  /** Get your active loans for each currency. */
  getActiveLoans(): Promise<ActiveLoans>;
  /** Get your lending history. */
  getLendingHistory(
    form?: LendingHistoryOptions
  ): Promise<LendingHistoryItem[]>;
  /** Toggle the autoRenew setting on an active loan. */
  toggleAutoRenew(form: OrderFilter): Promise<AutoRenewResult>;
  /** Swap `fromCurrency` to `toCurrency` if the currency pair is available. */
  swapCurrencies(form: SwapCurrenciesOptions): Promise<SwapResult>;
  get nonce(): () => number;
  set nonce(nonce: () => number);
}
