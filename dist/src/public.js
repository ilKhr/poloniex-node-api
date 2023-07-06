"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _a,
  _PublicClient_symbol,
  _PublicClient_formatCurrency,
  _PublicClient_formatCandle;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicClient = exports.DefaultSymbol = exports.ApiUrl = void 0;
const rpc_request_1 = require("rpc-request");
exports.ApiUrl = "https://api.poloniex.com/";
exports.DefaultSymbol = "BTC_USDT";
class PublicClient extends rpc_request_1.Fetch {
  constructor({ url = exports.ApiUrl, symbol = exports.DefaultSymbol } = {}) {
    super({ base_url: new URL(url), transform: "json" });
    _PublicClient_symbol.set(this, void 0);
    __classPrivateFieldSet(this, _PublicClient_symbol, symbol, "f");
  }
  get base_url() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return super.base_url;
  }
  get symbol() {
    return __classPrivateFieldGet(this, _PublicClient_symbol, "f");
  }
  get(path = "", { options, ...init } = {}) {
    const searchParams = new URLSearchParams();
    PublicClient.setQuery(searchParams, options);
    const url = new URL(path, this.base_url);
    url.search = searchParams.toString();
    return super.get(url.toString(), init);
  }
  /** Get all symbols and their trade limit info. */
  getMarkets() {
    return this.get("/markets");
  }
  /** Get a single symbol and its trade limit info. */
  getMarket({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
  } = {}) {
    return this.get(`/markets/${symbol}`);
  }
  async getCurrency({ currency, ...options } = {}) {
    if (typeof currency === "undefined") {
      const all = await this.get("/currencies", { options });
      return all.map((c) =>
        __classPrivateFieldGet(
          PublicClient,
          _a,
          "m",
          _PublicClient_formatCurrency
        ).call(PublicClient, c)
      );
    }
    const info = await this.get(`/currencies/${currency}`, { options });
    return __classPrivateFieldGet(
      PublicClient,
      _a,
      "m",
      _PublicClient_formatCurrency
    ).call(PublicClient, info);
  }
  /** Get current server time. */
  getSystemTime() {
    return this.get("/timestamp");
  }
  /** Get the latest trade price for all symbols. */
  getPrices() {
    return this.get("/markets/price");
  }
  /** Get the latest trade price for a symbol. */
  getPrice({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
  } = {}) {
    return this.get(`/markets/${symbol}/price`);
  }
  /** Get latest mark price for all cross margin symbols. */
  getMarkPrices() {
    return this.get("/markets/markPrice");
  }
  /** Get latest mark price for a single cross margin symbol. */
  getMarkPrice({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
  } = {}) {
    return this.get(`/markets/${symbol}/markPrice`);
  }
  /** Get components of the mark price for a given symbol. */
  getMarkPriceComponents({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
  } = {}) {
    return this.get(`/markets/${symbol}/markPriceComponents`);
  }
  /** Get the order book for a given symbol. */
  getOrderBook({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
    ...options
  } = {}) {
    return this.get(`/markets/${symbol}/orderBook`, { options });
  }
  /** Get OHLC for a symbol at given timeframe (interval). */
  async getCandles({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
    ...options
  }) {
    const raw = await this.get(`/markets/${symbol}/candles`, {
      options,
    });
    return raw.map((candle) =>
      __classPrivateFieldGet(
        PublicClient,
        _a,
        "m",
        _PublicClient_formatCandle
      ).call(PublicClient, candle)
    );
  }
  /** Get a list of recent trades. */
  async getPublicTrades({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
    ...options
  } = {}) {
    return this.get(`/markets/${symbol}/trades`, { options });
  }
  /** Get ticker in last 24 hours for all symbols. */
  getTickers() {
    return this.get("/markets/ticker24h");
  }
  /** Get ticker in last 24 hours for a given symbol. */
  getTicker({
    symbol = __classPrivateFieldGet(this, _PublicClient_symbol, "f"),
  } = {}) {
    return this.get(`/markets/${symbol}/ticker24h`);
  }
  getCollateral({ currency } = {}) {
    return this.get(
      typeof currency === "undefined"
        ? "/markets/collateralInfo"
        : `/markets/${currency}/collateralInfo`
    );
  }
  /** Get borrow rates information for all tiers and currencies. */
  getBorrowRates() {
    return this.get("/markets/borrowRatesInfo");
  }
  static setQuery(query, object) {
    for (const key in object) {
      const value = object[key];
      if (typeof value !== "undefined") {
        query.set(key, value.toString());
      }
    }
  }
}
exports.PublicClient = PublicClient;
(_a = PublicClient),
  (_PublicClient_symbol = new WeakMap()),
  (_PublicClient_formatCurrency = function _PublicClient_formatCurrency(
    currency
  ) {
    const [key] = Object.keys(currency);
    return { ...currency[key], currency: key };
  }),
  (_PublicClient_formatCandle = function _PublicClient_formatCandle([
    low,
    high,
    open,
    close,
    amount,
    quantity,
    buyTakerAmount,
    buyTakerQuantity,
    tradeCount,
    ts,
    weightedAverage,
    interval,
    startTime,
    closeTime,
  ]) {
    return {
      low,
      high,
      open,
      close,
      amount,
      quantity,
      buyTakerAmount,
      buyTakerQuantity,
      tradeCount,
      ts,
      weightedAverage,
      interval,
      startTime,
      closeTime,
    };
  });
