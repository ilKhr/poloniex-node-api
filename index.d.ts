import { EventEmitter } from 'events';

declare module 'poloniex' {
  export type callback<T> = (error: any, data: T) => void;

  export type TickerInfo = {
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
  };

  export type Tickers = {
    [currency: string]: TickerInfo;
  };

  export type Volume = {
    [currency: string]: string;
  };

  export type Volumes = {
    [currency: string]: string | Volume;
  };

  export type OrderBookInfo = {
    asks: [string, number][];
    bids: [string, number][];
    isFrozen: string;
    seq: number;
  };

  export type OrderBooksInfo = {
    [currency: string]: OrderBookInfo;
  };

  export type OrderBook = OrderBookInfo | OrderBooksInfo;

  export type Trade = {
    globalTradeID: number;
    tradeID: number;
    date: string;
    type: 'buy' | 'sell';
    rate: string;
    amount: string;
    total: string;
    orderNumber: number;
  };

  export type Candle = {
    date: number;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
    quoteVolume: number;
    weightedAverage: number;
  };

  export type CurrencyInfo = {
    id: number;
    name: string;
    humanType: string;
    currencyType: string;
    txFee: string;
    minConf: number;
    depositAddress: null | string;
    disabled: 0 | 1;
    delisted: 0 | 1;
    frozen: 0 | 1;
    isGeofenced: 0 | 1;
  };

  export type Currencies = {
    [currency: string]: CurrencyInfo;
  };

  export type Loan = {
    rate: string;
    amount: string;
    rangeMin: number;
    rangeMax: number;
  };

  export type Loans = {
    offers: Loan[];
    demands: Loan[];
  };

  export type getOptions = {
    command: string;
  };

  export type requestOptions = {
    method: 'GET' | 'POST';
    url: string;
    qs?: getOptions;
    form?: {
      nonce: number;
    } & getOptions;
  };

  export type CurrencyFilter = {
    currencyPair?: string;
  };

  export type BookFilter = {
    depth?: number;
  } & CurrencyFilter;

  export type TradesFilter = {
    currencyPair?: string;
    start?: number;
    end?: number;
  };

  export type TimeFilter = {
    start: number;
    end: number;
  };

  export type ChartFilter = {
    currencyPair?: string;
    period: 300 | 900 | 1800 | 7200 | 14400 | 86400;
  } & TimeFilter;

  export type AccountFilter = {
    account?: string;
  };

  export type CurrencyFilter = {
    currency: string;
  };

  export type Balances = {
    [currency: string]: string;
  };

  export type CompleteBalance = {
    available: string;
    onOrders: string;
    btcValue: string;
  };

  export type CompleteBalances = {
    [currency: string]: CompleteBalance;
  };

  export type Adresses = {
    [currency: string]: string;
  };

  export type NewAddress = {
    success: 0 | 1;
    response: string;
  };

  export type Adjustment = {
    currency: string;
    amount: string;
    timestamp: number;
    status: string;
    category: 'adjustment';
    adjustmentTitle: string;
    adjustmentDesc: string;
    adjustmentHelp: string;
  };

  export type Withdrawal = {
    withdrawalNumber: number;
    currency: string;
    address: string;
    amount: string;
    fee: string;
    timestamp: number;
    status: string;
    ipAddress: string;
    paymentID: string;
    canCancel: 0 | 1;
    canResendEmail: 0 | 1;
    paymentID: null | string;
  };

  export type Deposit = {
    currency: string;
    address: string;
    amount: string;
    confirmations: number;
    txid: string;
    timestamp: number;
    status: 'PENDING' | 'COMPLETE';
    depositNumber: number;
    category: 'deposit';
  };

  export type DepositsWithdrawals = {
    deposits: Deposit[];
    withdrawals: Withdrawal[];
    adjustments: Adjustment[];
  };

  export type WsRawMessage = Array<any>;

  export namespace WebsocketMessage {
    type Message = {
      channel_id: string | number;
      sequence: number | null;
    };
    export type Heartbeat = {
      subject: 'heartbeat';
    } & Message;

    export type Subscribe = {
      subject: 'subscribed' | 'unsubscribed';
    } & Message;

    export type Ticker = {
      subject: 'ticker';
      currencyPair: string | undefined;
    } & TickerInfo &
      Message;

    export type WSVolume = {
      subject: 'volume';
      time: string;
      users: number;
      volume: Volume;
    };

    export type Update = {
      subject: 'update';
      type: 'buy' | 'sell';
      price: string;
      size: string;
    } & Message;

    export type Snapshot = {
      subject: 'snapshot';
      currencyPair: string;
      asks: {
        [price: string]: string;
      };
      bids: {
        [price: string]: string;
      };
    } & Message;

    export type WSTrade = {
      subject: 'trade';
      tradeID: string;
      type: 'buy' | 'sell';
      price: string;
      size: string;
      timestamp: number;
    } & Message;

    export type Balance = {
      subject: 'balance';
      id: number;
      currencyPair: string | undefined;
      wallet: 'e' | 'm' | 'l';
      amount: string;
    } & Message;

    export type New = {
      subject: 'new';
      id: number;
      currencyPair: string | undefined;
      orderNumber: number;
      type: 'buy' | 'sell';
      rate: string;
      amount: string;
      date: string;
    } & Message;

    export type WSOrder = {
      subject: 'order';
      orderNumber: number;
      newAmount: string;
      orderType: 'filled' | 'canceled' | 'self-trade';
    } & Message;
  }

  export type WebsocketMessage =
    | WebsocketMessage.Heartbeat
    | WebsocketMessage.Subscribe
    | WebsocketMessage.Ticker
    | WebsocketMessage.WSVolume
    | WebsocketMessage.Update
    | WebsocketMessage.Snapshot
    | WebsocketMessage.WSTrade
    | WebsocketMessage.Balance
    | WebsocketMessage.New
    | WebsocketMessage.WSOrder;

  export type SubscriptionOptions = {
    channel_id: string | number;
  };

  export type PublicClientOptions = {
    currencyPair?: string;
    api_uri?: string;
    timeout?: number;
  };

  export type AuthenticatedClientOptions = {
    key: string;
    secret: number;
  } & PublicClientOptions;

  export type WebsocketClientOptions = {
    api_uri?: string;
    raw?: boolean;
    channels?: string | number | Array<string | number>;
    key?: string;
    secret?: string;
  };

  export class PublicClient {
    constructor(options?: PublicClientOptions);

    get(options: getOptions): Promise<any>;

    request(options: requestOptions): Promise<any>;

    cb(method: string, callback: callback<any>, options?: any);

    getTickers(): Promise<Tickers>;

    getVolume(): Promise<Volumes>;

    getOrderBook(options?: BookFilter): Promise<OrderBook>;

    getTradeHistory(options?: TradesFilter): Promise<Trade[]>;

    getChartData(options: ChartFilter): Promise<Candle[]>;

    getCurrencies(): Promise<Currencies>;

    getLoanOrders(options: CurrencyFilter): Promise<Loans>;
  }

  export class AuthenticatedClient {
    constructor(options: AuthenticatedClientOptions);

    post(options: getOptions): Promise<any>;

    getBalances(): Promise<Balances>;

    getCompleteBalances(options?: AccountFilter): Promise<CompleteBalances>;

    getDepositAddresses(): Promise<Adresses>;

    getNewAddress(options: CurrencyFilter): Promise<NewAddress>;

    getDepositsWithdrawals(options: TimeFilter): Promise<DepositsWithdrawals>;
  }

  export class WebsocketClient extends EventEmitter {
    constructor(options?: WebsocketClientOptions);

    on(event: 'message', eventHandler: (data: WebsocketMessage) => void): this;
    on(event: 'open', eventHandler: () => void): this;
    on(event: 'close', eventHandler: () => void): this;
    on(event: 'error', eventHandler: (error: any) => void): this;
    on(event: 'raw', eventHandler: (data: WsRawMessage) => void): this;

    connect(): void;
    disconnect(): void;

    subscribe(options: SubscriptionOptions): void;
    unsubscribe(options: SubscriptionOptions): void;
  }
}