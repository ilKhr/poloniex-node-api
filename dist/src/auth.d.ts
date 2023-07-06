import {
  PublicClient,
  IPublicClientOptions,
  IPoloniexGetOptions,
  IPoloniexFetchOptions,
  IRecordType,
} from "./public.js";
type IActivityType = "deposits" | "withdrawals";
export interface IActivityOptions
  extends Record<string, Date | number | string | undefined> {
  start: Date | number | string;
  end: Date | number | string;
  activityType?: IActivityType;
}
export interface IWithdrawOptions extends IRecordType {
  currency: string;
  amount: string;
  address: string;
  paymentId?: string;
  allowBorrow?: boolean;
}
export type ISide = "BUY" | "SELL";
export type ITimeInForce = "FOK" | "GTC" | "IOC";
export type IOrderType = "LIMIT_MAKER" | "LIMIT" | "MARKET";
export interface IOrderOptions extends IRecordType {
  symbol: string;
  side: ISide;
  timeInForce?: ITimeInForce;
  type?: IOrderType;
  accountType?: IAccountType;
  price?: string;
  quantity?: string;
  amount?: string;
  clientOrderId?: string;
  allowBorrow?: boolean;
}
type IDirection = "NEXT" | "PRE";
export interface IReplaceOrderOptions
  extends Omit<IOrderOptions, "accountType" | "side" | "symbol"> {
  allowBorrow?: boolean;
  proceedOnFailure?: boolean;
}
export interface IOpenOrdersOptions extends IRecordType {
  symbol?: string | undefined;
  side?: ISide | undefined;
  from?: number | string | undefined;
  direction?: IDirection | undefined;
  limit?: number | string | undefined;
}
type ISmartOrderType = "STOP_LIMIT" | "STOP";
export interface ISmartOrderOptions
  extends Omit<IOrderOptions, "allowBorrow" | "type"> {
  stopPrice: string;
  type?: ISmartOrderType | undefined;
}
export interface IReplaceSmartOrderOptions
  extends Omit<
    ISmartOrderOptions,
    "accountType" | "side" | "stopPrice" | "symbol"
  > {
  stopPrice?: string;
  proceedOnFailure?: boolean;
}
type IHistoryOrderState =
  | "CANCELED"
  | "FAILED"
  | "FILLED"
  | "PARTIALLY_CANCELED";
export interface IOrdersOptions extends IOpenOrdersOptions {
  accountType?: IAccountType;
  type?: IOrderType | IOrderType[] | undefined;
  states?: IHistoryOrderState | IHistoryOrderState[] | undefined;
  hideCancel?: boolean | undefined;
  startTime?: number | undefined;
  endTime?: number | undefined;
}
export interface ITradeOptions {
  limit?: number | string | undefined;
  endTime?: number | string | undefined;
  startTime?: number | string | undefined;
  from?: number | string | undefined;
  direction?: IDirection;
  symbols?: string[] | string | undefined;
}
export type IAccountType = "FUTURES" | "SPOT";
type IAccountState = "LOCKED" | "NORMAL";
export interface IAccount {
  accountId: string;
  accountType: IAccountType;
  accountState: IAccountState;
}
export interface IAccountBalanceOptions extends IRecordType {
  accountType?: IAccountType | undefined;
  id?: string | undefined;
}
export interface IBalance {
  currencyId: string;
  currency: string;
  available: string;
  hold: string;
}
export interface IAccountBalance extends Omit<IAccount, "accountState"> {
  balances: IBalance[];
}
export declare enum AccountActivities {
  ALL = 200,
  AIRDROP = 201,
  COMMISSION_REBATE = 202,
  STAKING = 203,
  REFERAL_REBATE = 204,
  CREDIT_ADJUSTMENT = 104,
  DEBIT_ADJUSTMENT = 105,
  OTHER = 199,
}
export interface IAccountActivityOptions extends IRecordType {
  startTime?: number | string | undefined;
  endTime?: number | string | undefined;
  activityType?: AccountActivities | undefined;
  limit?: number | string | undefined;
  from?: number | string | undefined;
  direction?: IDirection | undefined;
  currency?: string | undefined;
}
export interface ITransferOptions extends IRecordType {
  currency: string;
  amount: string;
  fromAccount: IAccountType;
  toAccount: IAccountType;
}
export type IAccountTransferOptions = Omit<
  IAccountActivityOptions,
  "activityType"
>;
export interface IBaseWalletActivity {
  currency: string;
  address: string;
  amount: string;
  txid: string;
  timestamp: number;
}
type IDepositStatus = "COMPLETED" | "PENDING";
export interface IDeposit extends IBaseWalletActivity {
  depositNumber: number;
  confirmations: number;
  status: IDepositStatus;
}
type IWithdrawalStatus =
  | "AWAITING APPROVAL"
  | "COMPLETE ERROR"
  | "COMPLETED"
  | "PENDING";
export interface IWithdrawal extends IBaseWalletActivity {
  withdrawalRequestsId: number;
  fee: string;
  status: IWithdrawalStatus;
  ipAddress: string;
  paymentID: string | null;
}
export interface IActivity {
  deposits: IDeposit[];
  withdrawals: IWithdrawal[];
}
export interface IMarginInfo {
  totalAccountValue: string;
  totalMargin: string;
  usedMargin: string;
  freeMargin: string;
  maintenanceMargin: string;
  marginRatio: string;
  time: number;
}
export interface IBorrow {
  currency: string;
  available: string;
  borrowed: string;
  hold: string;
  maxAvailable: string;
  hourlyBorrowRate: string;
  version: string;
}
export interface IMaxSize {
  symbol: string;
  maxLeverage: number;
  availableBuy: string;
  maxAvailableBuy: string;
  availableSell: string;
  maxAvailableSell: string;
}
export interface IOrderId {
  id: string;
  clientOrderId: string;
}
export type IOrderIds = ({
  clientOrderId: string;
} & (
  | {
      code: number;
      message: string;
    }
  | {
      id: string;
    }
))[];
type IOpenOrderState = "NEW" | "PARTIALLY_FILLED";
export type IOrderState =
  | IHistoryOrderState
  | IOpenOrderState
  | "PENDING_CANCEL";
export type IOrderSource = "API" | "APP" | "SMART" | "WEB";
export interface IOrder {
  id: string;
  clientOrderId: string;
  symbol: string;
  state: IOrderState;
  accountType: IAccountType;
  side: ISide;
  type: IOrderType;
  timeInForce: ITimeInForce;
  quantity: string;
  price: string;
  avgPrice: string;
  amount: string;
  filledQuantity: string;
  filledAmount: string;
  createTime: number;
  updateTime: number;
  orderSource?: IOrderSource;
  loan?: boolean;
  cancelReason?: number;
}
export interface IOpenOrder extends Omit<IOrder, "cancelReason"> {
  state: IOpenOrderState;
}
type ICanceledOrderState = "PENDING_CANCEL";
type ISmartOrderState =
  | ICanceledOrderState
  | "CANCELED"
  | "FAILED"
  | "PENDING_NEW"
  | "TRIGGERED";
export interface ISmartOrder
  extends Omit<
    IOrder,
    | "avgPrice"
    | "cancelReason"
    | "filledAmount"
    | "filledQuantity"
    | "loan"
    | "orderSource"
    | "state"
    | "type"
  > {
  type: ISmartOrderType;
  state: ISmartOrderState;
  stopPrice: string;
  triggeredOrder?: IOrder;
}
export interface ICanceledOrder {
  orderId: string;
  clientOrderId: string;
  state: ICanceledOrderState;
  code: number;
  message: string;
}
export interface IKillSwitch {
  startTime: string;
  cancellationTime: string;
}
export interface IOpenSmartOrder extends Omit<ISmartOrder, "triggeredOrder"> {
  state: "PENDING_NEW";
}
type ICanceledSmartOrderState = "CANCELED";
export interface ICanceledSmartOrder extends Omit<ICanceledOrder, "state"> {
  state: ICanceledSmartOrderState;
}
export interface IHistoricalOrder extends IOrder {
  state: IHistoryOrderState;
}
export type IMatchRole = "MAKER" | "TAKER";
export interface ITrade {
  id: string;
  symbol: string;
  accountType: IAccountType;
  orderId: string;
  side: ISide;
  type: IOrderType;
  matchRole: IMatchRole;
  createTime: number;
  price: string;
  quantity: string;
  amount: string;
  feeCurrency: string;
  feeAmount: string;
  pageId: string;
  clientOrderId: string;
  loan?: boolean;
}
type IActivityState = "FAILED" | "PROCESSSING" | "SUCCESS";
export interface IBaseAccountActivity {
  id: string;
  currency: string;
  amount: string;
  state: IActivityState;
  createTime: number;
}
export interface IAccountActivity extends IBaseAccountActivity {
  description: string;
  activityType: AccountActivities;
}
export interface IAccountTransfer extends IBaseAccountActivity {
  fromAccount: IAccountType;
  toAccount: IAccountType;
}
export interface IFee {
  trxDiscount: boolean;
  makerRate: string;
  takerRate: string;
  volume30D: string;
  specialFeeRates: {
    symbol: string;
    makerRate: string;
    takerRate: string;
  }[];
}
export interface AuthenticatedClientOptions extends IPublicClientOptions {
  key: string;
  secret: string;
  signTimestamp?: (() => string) | undefined;
}
export declare class AuthenticatedClient extends PublicClient {
  #private;
  constructor({
    key,
    secret,
    signTimestamp,
    ...rest
  }: AuthenticatedClientOptions);
  get<T = unknown>(path?: string, init?: IPoloniexGetOptions): Promise<T>;
  post<T = unknown>(path?: string, init?: IPoloniexFetchOptions): Promise<T>;
  delete<T = unknown>(path?: string, init?: IPoloniexFetchOptions): Promise<T>;
  put<T = unknown>(path?: string, init?: IPoloniexFetchOptions): Promise<T>;
  fetch<T = unknown>(
    path?: string,
    { method, options, ...init }?: IPoloniexFetchOptions
  ): Promise<T>;
  /** Get a list of all accounts. */
  getAccounts(): Promise<IAccount[]>;
  /** Get a list of all accounts. */
  getAccountBalances(options: { id: string }): Promise<[IAccountBalance]>;
  getAccountBalances(options?: {
    accountType?: IAccountBalanceOptions["accountType"];
  }): Promise<IAccountBalance[]>;
  /** Get a list of activities such as airdrop, rebates, staking, credit/debit adjustments, and other (historical adjustments). */
  getAccountActivity(
    options?: IAccountActivityOptions
  ): Promise<IAccountActivity[]>;
  /** Transfer amount of currency from an account to another account  */
  transfer(options: ITransferOptions): Promise<{
    transferId: string;
  }>;
  /** Get a list of transfer records. */
  getAccountTransfers(
    options?: IAccountTransferOptions
  ): Promise<IAccountTransfer[]>;
  /** Get fee rate. */
  getFeeInfo(): Promise<IFee>;
  /** Get deposit addresses. */
  getWallets(options?: { currency?: string }): Promise<Record<string, string>>;
  /** Get deposit and withdrawal activity history within a range window. */
  getWalletsActivity({
    start,
    end,
    ...options
  }: IActivityOptions): Promise<IActivity>;
  /** Create a new address for a currency. */
  newAddress(options: { currency: string }): Promise<{
    address: string;
  }>;
  /** Immediately place a withdrawal for a given currency, with no email confirmation. */
  withdraw(options: IWithdrawOptions): Promise<{
    withdrawalRequestsId: number;
  }>;
  /** Get account margin information. */
  getMargin({
    accountType,
  }?: {
    accountType?: IAccountType;
  }): Promise<IMarginInfo>;
  /** Get borrow status of currencies. */
  getBorrowStatus(options?: { currency?: string }): Promise<IBorrow>;
  /** Get maximum and available buy/sell amount for a given symbol. */
  getMaxSize({ symbol }?: { symbol?: string | undefined }): Promise<IMaxSize>;
  /** Create an order. */
  createOrder(options: IOrderOptions): Promise<IOrderId>;
  /** Create multiple orders via a single request. */
  createOrders(options: IOrderOptions[]): Promise<IOrderIds>;
  /** Cancel an existing active order, new or partially filled, and place a new order on the same symbol with details from existing order unless amended by new parameters. */
  replaceOrder(
    id:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        },
    options?: IReplaceOrderOptions
  ): Promise<IOrderId>;
  /** Get a list of active orders. */
  getOpenOrders(options?: IOpenOrdersOptions): Promise<IOpenOrder[]>;
  /** Get an order’s status. */
  getOrder(
    options:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
  ): Promise<IOrder>;
  /** Cancel an active order. */
  cancelOrder(
    options:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
  ): Promise<ICanceledOrder>;
  /** Batch cancel one or many active orders. */
  cancelOrders(
    orders: (
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
    )[]
  ): Promise<ICanceledOrder[]>;
  /** Batch cancel all orders. */
  cancelAllOrders(options?: {
    symbols?: string[];
    accountTypes?: IAccountType[];
  }): Promise<ICanceledOrder[]>;
  killSwitch(options: { timeout: number | string }): Promise<IKillSwitch>;
  /** Get status of kill switch. */
  getKillSwitch(): Promise<IKillSwitch>;
  /** Create a smart order. */
  createSmartOrder(options: ISmartOrderOptions): Promise<IOrderId>;
  /** Cancel an existing untriggered smart order and place a new smart order on the same symbol with details from existing smart order unless amended by new parameters. */
  replaceSmartOrder(
    id:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        },
    options: IReplaceSmartOrderOptions
  ): Promise<IOrderId>;
  /** Get a list of (pending) smart orders. */
  getOpenSmartOrders(options?: { limit?: number }): Promise<IOpenSmartOrder[]>;
  /** Get a smart order’s status. */
  getSmartOrder(
    options:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
  ): Promise<ISmartOrder | null>;
  /** Cancel an active smart order. */
  cancelSmartOrder(
    options:
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
  ): Promise<ICanceledSmartOrder>;
  /** Batch cancel one or many active smart orders. */
  cancelSmartOrders(
    orders: (
      | {
          clientOrderId: string;
        }
      | {
          id: string;
        }
    )[]
  ): Promise<ICanceledSmartOrder[]>;
  /** Batch cancel all orders. */
  cancelAllSmartOrders(options?: {
    symbols?: string[];
    accountTypes?: IAccountType[];
  }): Promise<ICanceledSmartOrder[]>;
  /** Get a list of historical orders. */
  getOrders({ ...options }?: IOrdersOptions): Promise<IHistoricalOrder[]>;
  /** Get a list of all trades. */
  getTrades({ ...options }?: ITradeOptions): Promise<ITrade[]>;
  /** Get a list of all trades for an order specified by its orderId. */
  getOrderTrades({ id }: { id: string }): Promise<ITrade[]>;
}
export {};
