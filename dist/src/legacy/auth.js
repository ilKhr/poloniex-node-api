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
  _AuthenticatedClient_nonce;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedClient = void 0;
const public_js_1 = require("./public.js");
const signer_js_1 = require("./signer.js");
class AuthenticatedClient extends public_js_1.PublicClient {
  constructor({ key, secret, ...rest }) {
    super(rest);
    _AuthenticatedClient_key.set(this, void 0);
    _AuthenticatedClient_secret.set(this, void 0);
    _AuthenticatedClient_nonce.set(this, void 0);
    __classPrivateFieldSet(this, _AuthenticatedClient_key, key, "f");
    __classPrivateFieldSet(this, _AuthenticatedClient_secret, secret, "f");
    __classPrivateFieldSet(
      this,
      _AuthenticatedClient_nonce,
      () => Date.now(),
      "f"
    );
  }
  async post(url, { body = new URLSearchParams() } = {}) {
    const nonce = this.nonce();
    body.set("nonce", `${nonce}`);
    const { key, sign } = (0, signer_js_1.SignRequest)({
      key: __classPrivateFieldGet(this, _AuthenticatedClient_key, "f"),
      secret: __classPrivateFieldGet(this, _AuthenticatedClient_secret, "f"),
      body: body.toString(),
    });
    const data = await super.post(url, { headers: { key, sign }, body });
    if (typeof data.error !== "undefined") {
      throw new Error(data.error);
    } else if (
      "success" in data &&
      data.success !== true &&
      data.success !== 1
    ) {
      throw new Error(data.result?.error ?? data.message);
    }
    return data;
  }
  /** Get all of your balances available for trade after having deducted all open orders. */
  getBalances() {
    const command = "returnBalances";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance. */
  getCompleteBalances(form = {}) {
    const command = "returnCompleteBalances";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get all of your deposit addresses. */
  getDepositAddresses() {
    const command = "returnDepositAddresses";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Generate a new deposit address. */
  getNewAddress(form) {
    const command = "generateNewAddress";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get your adjustment, deposit, and withdrawal history within a range window. */
  getDepositsWithdrawals(form) {
    const command = "returnDepositsWithdrawals";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get your open orders for a given market. */
  getOpenOrders({ currencyPair = this.currencyPair } = {}) {
    const command = "returnOpenOrders";
    const body = new URLSearchParams({ command, currencyPair });
    return this.post("/tradingApi", { body });
  }
  /** Get your trade history for a given market. */
  getHistoryTrades({ currencyPair = this.currencyPair, ...form } = {}) {
    const command = "returnTradeHistory";
    const body = new URLSearchParams({ command, currencyPair });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get all trades involving a given order. */
  getOrderTrades(form) {
    const command = "returnOrderTrades";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get the status of a given order. */
  getOrderStatus(form) {
    const command = "returnOrderStatus";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Places a limit buy order. */
  buy({ currencyPair = this.currencyPair, ...form }) {
    const command = "buy";
    const body = new URLSearchParams({ command, currencyPair });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Places a limit sell order. */
  sell({ currencyPair = this.currencyPair, ...form }) {
    const command = "sell";
    const body = new URLSearchParams({ command, currencyPair });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Cancel an order you have placed in a given market. */
  cancelOrder(form) {
    const command = "cancelOrder";
    const body = new URLSearchParams({ command });
    if ("clientOrderId" in form) {
      const { clientOrderId } = form;
      public_js_1.PublicClient.addOptions(body, { clientOrderId });
    } else {
      const { orderNumber } = form;
      public_js_1.PublicClient.addOptions(body, { orderNumber });
    }
    return this.post("/tradingApi", { body });
  }
  /** Cancel all open orders in a given market or, if no market is provided, all open orders in all markets. */
  cancelAllOrders(form = {}) {
    const command = "cancelAllOrders";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Cancels an order and places a new one of the same type in a single atomic transaction. */
  moveOrder(form) {
    const command = "moveOrder";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Immediately place a withdrawal for a given currency. */
  withdraw(form) {
    const command = "withdraw";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get your current trading fees and trailing 30-day volume in BTC. */
  getFeeInfo() {
    const command = "returnFeeInfo";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Get your balances sorted by account. */
  getAccountBalances(form = {}) {
    const command = "returnAvailableAccountBalances";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get your current tradable balances for each currency in each market for which margin trading is enabled. */
  getTradableBalances() {
    const command = "returnTradableBalances";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Transfer funds from one account to another. */
  transferBalance(form) {
    const command = "transferBalance";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get a summary of your entire margin account. */
  getMarginSummary() {
    const command = "returnMarginAccountSummary";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Place a margin buy order in a given market. */
  marginBuy({ currencyPair = this.currencyPair, ...form }) {
    const command = "marginBuy";
    const body = new URLSearchParams({ command, currencyPair });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Place a margin sell order in a given market. */
  marginSell({ currencyPair = this.currencyPair, ...form }) {
    const command = "marginSell";
    const body = new URLSearchParams({ command, currencyPair });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get information about your margin position in a given market. */
  getMarginPosition({ currencyPair = this.currencyPair } = {}) {
    const command = "getMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    return this.post("/tradingApi", { body });
  }
  /** Close your margin position in a given market using a market order. */
  closeMarginPosition({ currencyPair = this.currencyPair } = {}) {
    const command = "closeMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    return this.post("/tradingApi", { body });
  }
  /** Create a loan offer for a given currency. */
  createLoanOffer(form) {
    const command = "createLoanOffer";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Cancel a loan offer. */
  cancelLoanOffer(form) {
    const command = "cancelLoanOffer";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Get your open loan offers for each currency. */
  getOpenLoanOffers() {
    const command = "returnOpenLoanOffers";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Get your active loans for each currency. */
  getActiveLoans() {
    const command = "returnActiveLoans";
    const body = new URLSearchParams({ command });
    return this.post("/tradingApi", { body });
  }
  /** Get your lending history. */
  getLendingHistory(form = {}) {
    const command = "returnLendingHistory";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Toggle the autoRenew setting on an active loan. */
  toggleAutoRenew(form) {
    const command = "toggleAutoRenew";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  /** Swap `fromCurrency` to `toCurrency` if the currency pair is available. */
  swapCurrencies(form) {
    const command = "swapCurrencies";
    const body = new URLSearchParams({ command });
    public_js_1.PublicClient.addOptions(body, { ...form });
    return this.post("/tradingApi", { body });
  }
  get nonce() {
    return __classPrivateFieldGet(this, _AuthenticatedClient_nonce, "f");
  }
  set nonce(nonce) {
    __classPrivateFieldSet(this, _AuthenticatedClient_nonce, nonce, "f");
  }
}
exports.AuthenticatedClient = AuthenticatedClient;
(_AuthenticatedClient_key = new WeakMap()),
  (_AuthenticatedClient_secret = new WeakMap()),
  (_AuthenticatedClient_nonce = new WeakMap());
