"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicClient =
  exports.Headers =
  exports.ApiLimit =
  exports.DefaultPair =
  exports.ApiUri =
    void 0;
const rpc_request_1 = require("rpc-request");
exports.ApiUri = "https://poloniex.com";
exports.DefaultPair = "USDT_BTC";
exports.ApiLimit = 100;
exports.Headers = { "User-Agent": "poloniex-node-api-client" };
class PublicClient extends rpc_request_1.Fetch {
  constructor({ currencyPair = exports.DefaultPair } = {}) {
    super({
      headers: exports.Headers,
      reject: false,
      transform: "json",
      base_url: exports.ApiUri,
    });
    Object.defineProperty(this, "currencyPair", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.currencyPair = currencyPair;
  }
  async get(url) {
    const response = await super.get(url);
    if (typeof response.error !== "undefined") {
      throw new Error(response.error);
    }
    return response;
  }
  /** Retrieves summary information for each currency pair listed on the exchange. */
  getTickers() {
    const command = "returnTicker";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command });
    return this.get(url.toString());
  }
  /** Retrieves the 24-hour volume for all markets as well as totals for primary currencies. */
  getVolume() {
    const command = "return24hVolume";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command });
    return this.get(url.toString());
  }
  /** Get the order book for a given market. */
  getOrderBook({
    currencyPair = this.currencyPair,
    depth = exports.ApiLimit,
  } = {}) {
    const command = "returnOrderBook";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, depth });
    return this.get(url.toString());
  }
  /** Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`. */
  getTradeHistory({ currencyPair = this.currencyPair, ...rest } = {}) {
    const command = "returnTradeHistory";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, ...rest });
    return this.get(url.toString());
  }
  /** Get candlestick chart data. */
  getChartData({ currencyPair = this.currencyPair, ...rest }) {
    const command = "returnChartData";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, ...rest });
    return this.get(url.toString());
  }
  getCurrencies({ includeMultiChainCurrencies = false } = {}) {
    const command = "returnCurrencies";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command, includeMultiChainCurrencies });
    return this.get(url.toString());
  }
  /**  Get the list of loan offers and demands for a given currency. */
  getLoanOrders(qs) {
    const command = "returnLoanOrders";
    const url = new URL("/public", exports.ApiUri);
    PublicClient.addOptions(url, { command, ...qs });
    return this.get(url.toString());
  }
  static addOptions(target, data) {
    const searchParams = target instanceof URL ? target.searchParams : target;
    for (const key in data) {
      const value = data[key];
      if (typeof value !== "undefined") {
        searchParams.append(key, value.toString());
      }
    }
  }
}
exports.PublicClient = PublicClient;
