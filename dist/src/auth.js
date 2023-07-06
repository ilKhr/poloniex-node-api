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
var _AuthenticatedClient_key,
  _AuthenticatedClient_secret,
  _AuthenticatedClient_signTimestamp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedClient = exports.AccountActivities = void 0;
const public_js_1 = require("./public.js");
const signature_js_1 = require("./signature.js");
var AccountActivities;
(function (AccountActivities) {
  AccountActivities[(AccountActivities["ALL"] = 200)] = "ALL";
  AccountActivities[(AccountActivities["AIRDROP"] = 201)] = "AIRDROP";
  AccountActivities[(AccountActivities["COMMISSION_REBATE"] = 202)] =
    "COMMISSION_REBATE";
  AccountActivities[(AccountActivities["STAKING"] = 203)] = "STAKING";
  AccountActivities[(AccountActivities["REFERAL_REBATE"] = 204)] =
    "REFERAL_REBATE";
  AccountActivities[(AccountActivities["CREDIT_ADJUSTMENT"] = 104)] =
    "CREDIT_ADJUSTMENT";
  AccountActivities[(AccountActivities["DEBIT_ADJUSTMENT"] = 105)] =
    "DEBIT_ADJUSTMENT";
  AccountActivities[(AccountActivities["OTHER"] = 199)] = "OTHER";
})(
  (AccountActivities =
    exports.AccountActivities || (exports.AccountActivities = {}))
);
class AuthenticatedClient extends public_js_1.PublicClient {
  constructor({
    key,
    secret,
    signTimestamp = () => Date.now().toString(),
    ...rest
  }) {
    super(rest);
    _AuthenticatedClient_key.set(this, void 0);
    _AuthenticatedClient_secret.set(this, void 0);
    _AuthenticatedClient_signTimestamp.set(this, void 0);
    __classPrivateFieldSet(this, _AuthenticatedClient_key, key, "f");
    __classPrivateFieldSet(this, _AuthenticatedClient_secret, secret, "f");
    __classPrivateFieldSet(
      this,
      _AuthenticatedClient_signTimestamp,
      signTimestamp,
      "f"
    );
  }
  get(path = "", init = {}) {
    return this.fetch(path, { ...init, method: "GET" });
  }
  post(path = "", init = {}) {
    return this.fetch(path, { ...init, method: "POST" });
  }
  delete(path = "", init = {}) {
    return this.fetch(path, { ...init, method: "DELETE" });
  }
  put(path = "", init = {}) {
    return this.fetch(path, { ...init, method: "PUT" });
  }
  async fetch(path = "", { method = "GET", options = {}, ...init } = {}) {
    const signTimestamp = __classPrivateFieldGet(
      this,
      _AuthenticatedClient_signTimestamp,
      "f"
    ).call(this);
    const searchParams = new URLSearchParams();
    const has_body = method !== "GET" && Object.keys(options).length > 0;
    if (method === "GET") {
      if (Array.isArray(options)) {
        return Promise.reject(new TypeError("`options` shoud not be an array"));
      }
      public_js_1.PublicClient.setQuery(searchParams, options);
    } else if (has_body) {
      searchParams.set("requestBody", JSON.stringify(options));
    }
    searchParams.set("signTimestamp", signTimestamp);
    if (method === "GET") {
      searchParams.sort();
    }
    const { ...headers } = (0, signature_js_1.signature)({
      method,
      searchParams,
      signTimestamp,
      path,
      key: __classPrivateFieldGet(this, _AuthenticatedClient_key, "f"),
      secret: __classPrivateFieldGet(this, _AuthenticatedClient_secret, "f"),
    });
    init.headers = init.headers ? { ...init.headers, ...headers } : headers;
    const url = new URL(path, this.base_url);
    if (method === "GET") {
      url.search = searchParams.toString();
    } else if (has_body) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(options);
    }
    return super.fetch(url.toString(), { method, ...init });
  }
  /** Get a list of all accounts. */
  getAccounts() {
    return this.get("/accounts");
  }
  getAccountBalances({ id, ...options } = {}) {
    if (typeof id === "string") {
      return this.get(`/accounts/${id}/balances`);
    }
    return this.get("/accounts/balances", { options });
  }
  /** Get a list of activities such as airdrop, rebates, staking, credit/debit adjustments, and other (historical adjustments). */
  getAccountActivity(options = {}) {
    return this.get("/accounts/activity", { options });
  }
  /** Transfer amount of currency from an account to another account  */
  transfer(options) {
    return this.post("/accounts/transfer", { options });
  }
  /** Get a list of transfer records. */
  getAccountTransfers(options = {}) {
    return this.get("/accounts/transfer", { options });
  }
  /** Get fee rate. */
  getFeeInfo() {
    return this.get("/feeinfo");
  }
  /** Get deposit addresses. */
  getWallets(options = {}) {
    return this.get("/wallets/addresses", { options });
  }
  /** Get deposit and withdrawal activity history within a range window. */
  getWalletsActivity({ start, end, ...options }) {
    return this.get("/wallets/activity", {
      options: {
        ...options,
        start: start instanceof Date ? start.getTime() : start,
        end: end instanceof Date ? end.getTime() : end,
      },
    });
  }
  /** Create a new address for a currency. */
  newAddress(options) {
    return this.post("/wallets/address", { options });
  }
  /** Immediately place a withdrawal for a given currency, with no email confirmation. */
  withdraw(options) {
    return this.post("/wallets/withdraw", {
      options,
    });
  }
  /** Get account margin information. */
  getMargin({ accountType = "SPOT" } = {}) {
    return this.get("/margin/accountMargin", {
      options: { accountType },
    });
  }
  /** Get borrow status of currencies. */
  getBorrowStatus(options = {}) {
    return this.get("/margin/borrowStatus", { options });
  }
  /** Get maximum and available buy/sell amount for a given symbol. */
  getMaxSize({ symbol = this.symbol } = {}) {
    return this.get("/margin/maxSize", { options: { symbol } });
  }
  /** Create an order. */
  createOrder(options) {
    return this.post("/orders", { options });
  }
  /** Create multiple orders via a single request. */
  createOrders(options) {
    if (!options.length) {
      return Promise.reject(new TypeError("Empty arrays are not allowed"));
    }
    return this.post("/orders/batch", { options });
  }
  replaceOrder({ id, clientOrderId }, options = {}) {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing")
        )
      : this.put(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId}`}`,
          { options }
        );
  }
  /** Get a list of active orders. */
  getOpenOrders(options = {}) {
    return this.get("/orders", { options });
  }
  getOrder({ id, clientOrderId }) {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing")
        )
      : this.get(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId}`}`
        );
  }
  cancelOrder({ id, clientOrderId }) {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing")
        )
      : this.delete(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId}`}`
        );
  }
  /** Batch cancel one or many active orders. */
  cancelOrders(orders) {
    const options = orders.reduce(
      (previousValue, currentValue) => {
        if ("id" in currentValue) {
          previousValue.orderIds.push(currentValue.id);
        } else if ("clientOrderId" in currentValue) {
          previousValue.clientOrderIds.push(currentValue.clientOrderId);
        }
        return previousValue;
      },
      { orderIds: [], clientOrderIds: [] }
    );
    if (!options.orderIds.length && !options.clientOrderIds.length) {
      return Promise.reject(new TypeError("No orders to cancel"));
    }
    return this.delete("/orders/cancelByIds", { options });
  }
  /** Batch cancel all orders. */
  cancelAllOrders(options = {}) {
    return this.delete("/orders", { options });
  }
  killSwitch(options) {
    const timeout = Number(options.timeout);
    if (
      timeout !== -1 &&
      (!Number.isInteger(timeout) || timeout < 10 || timeout > 600)
    ) {
      return Promise.reject(new TypeError("Invalid timeout value"));
    }
    return this.post("/orders/killSwitch", {
      options: { timeout: `${timeout}` },
    });
  }
  /** Get status of kill switch. */
  getKillSwitch() {
    return this.get("/orders/killSwitchStatus");
  }
  /** Create a smart order. */
  createSmartOrder(options) {
    return this.post("/smartorders", { options });
  }
  replaceSmartOrder({ id, clientOrderId }, options) {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing")
        )
      : this.put(
          `/smartorders/${
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            typeof id === "string" ? id : `cid:${clientOrderId}`
          }`,
          { options }
        );
  }
  /** Get a list of (pending) smart orders. */
  getOpenSmartOrders(options = {}) {
    return this.get("/smartorders", { options });
  }
  async getSmartOrder({ id, clientOrderId }) {
    if (typeof id !== "string" && typeof clientOrderId !== "string") {
      throw new TypeError("Either `id` or `clientOrderId` is missing");
    }
    const [order] = await this.get(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `/smartorders/${typeof id === "string" ? id : `cid:${clientOrderId}`}`
    );
    return order ?? null;
  }
  cancelSmartOrder({ id, clientOrderId }) {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing")
        )
      : this.delete(
          `/smartorders/${
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            typeof id === "string" ? id : `cid:${clientOrderId}`
          }`
        );
  }
  /** Batch cancel one or many active smart orders. */
  cancelSmartOrders(orders) {
    const options = orders.reduce(
      (previousValue, currentValue) => {
        if ("id" in currentValue) {
          previousValue.orderIds.push(currentValue.id);
        } else if ("clientOrderId" in currentValue) {
          previousValue.clientOrderIds.push(currentValue.clientOrderId);
        }
        return previousValue;
      },
      { orderIds: [], clientOrderIds: [] }
    );
    if (!options.orderIds.length && !options.clientOrderIds.length) {
      return Promise.reject(new TypeError("No smart orders to cancel"));
    }
    return this.delete("/smartorders/cancelByIds", {
      options,
    });
  }
  /** Batch cancel all orders. */
  cancelAllSmartOrders(options = {}) {
    return this.delete("/smartorders", { options });
  }
  /** Get a list of historical orders. */
  getOrders({ ...options } = {}) {
    if (Array.isArray(options.states)) {
      options.states = options.states.join(",");
    }
    if (Array.isArray(options.type)) {
      options.type = options.type.join(",");
    }
    return this.get("/orders/history", { options });
  }
  /** Get a list of all trades. */
  getTrades({ ...options } = {}) {
    if (Array.isArray(options.symbols)) {
      options.symbols = options.symbols.join(",");
    }
    return this.get("/trades", { options });
  }
  /** Get a list of all trades for an order specified by its orderId. */
  getOrderTrades({ id }) {
    return this.get(`/orders/${id}/trades`);
  }
}
exports.AuthenticatedClient = AuthenticatedClient;
(_AuthenticatedClient_key = new WeakMap()),
  (_AuthenticatedClient_secret = new WeakMap()),
  (_AuthenticatedClient_signTimestamp = new WeakMap());
