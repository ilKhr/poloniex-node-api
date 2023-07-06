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
var _WebSocketClient_instances,
  _WebSocketClient_key,
  _WebSocketClient_secret,
  _WebSocketClient_nonce,
  _WebSocketClient_send;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = exports.DefaultChannels = exports.WsUri = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
const node_events_1 = require("node:events");
const ws_1 = require("ws");
const currencies_js_1 = require("./currencies.js");
const currencypairs_js_1 = require("./currencypairs.js");
const signer_js_1 = require("./signer.js");
exports.WsUri = "wss://api2.poloniex.com";
exports.DefaultChannels = [121];
class WebSocketClient extends node_events_1.EventEmitter {
  /** Create WebSocketClient. */
  constructor({
    wsUri = exports.WsUri,
    raw = true,
    channels = exports.DefaultChannels,
    key,
    secret,
  } = {}) {
    super();
    _WebSocketClient_instances.add(this);
    _WebSocketClient_key.set(this, void 0);
    _WebSocketClient_secret.set(this, void 0);
    _WebSocketClient_nonce.set(this, void 0);
    Object.defineProperty(this, "ws", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "raw", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "channels", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "wsUri", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.raw = raw;
    this.channels = channels;
    __classPrivateFieldSet(this, _WebSocketClient_nonce, () => Date.now(), "f");
    this.wsUri = wsUri;
    if (typeof key !== "undefined" && typeof secret !== "undefined") {
      __classPrivateFieldSet(this, _WebSocketClient_key, key, "f");
      __classPrivateFieldSet(this, _WebSocketClient_secret, secret, "f");
    }
  }
  /** Connect to the websocket. */
  async connect() {
    switch (this.ws?.readyState) {
      case ws_1.WebSocket.CLOSING:
      case ws_1.WebSocket.CONNECTING:
        throw new Error(`Could not connect. State: ${this.ws.readyState}`);
      case ws_1.WebSocket.OPEN:
        return;
      default:
        break;
    }
    await new Promise((resolve, reject) => {
      this.ws = new ws_1.WebSocket(this.wsUri);
      this.ws
        .once("open", resolve)
        .once("error", reject)
        .on("open", () => {
          this.emit("open");
          for (const channel of this.channels) {
            this.subscribe(channel).catch((error) => {
              this.emit("error", error);
            });
          }
        })
        .on("close", () => {
          this.emit("close");
        })
        .on("message", (data) => {
          try {
            const jsondata = JSON.parse(data);
            if ("error" in jsondata) {
              this.emit("error", jsondata);
              return;
            }
            if (this.raw) {
              this.emit("rawMessage", jsondata);
            }
            if (jsondata.length === 1) {
              const message = WebSocketClient.formatHeartbeat(jsondata);
              this.emit("message", message);
            } else if (jsondata.length === 2) {
              const message = WebSocketClient.formatAcknowledge(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === null && jsondata[0] === 1002) {
              const message = WebSocketClient.formatTicker(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === null) {
              const message = WebSocketClient.formatVolume(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === "") {
              const messages = WebSocketClient.formatAccount(jsondata);
              for (const message of messages) {
                this.emit("message", message);
              }
            } else {
              const messages = WebSocketClient.formatUpdate(jsondata);
              for (const message of messages) {
                this.emit("message", message);
              }
            }
          } catch (error) {
            this.emit("error", error);
          }
        })
        .on("error", (error) => {
          if (typeof error !== "undefined") {
            this.emit("error", error);
          }
        });
    });
  }
  /** Disconnect from the websocket. */
  async disconnect() {
    switch (this.ws?.readyState) {
      case ws_1.WebSocket.CLOSED:
        return;
      case ws_1.WebSocket.CLOSING:
      case ws_1.WebSocket.CONNECTING:
        throw new Error(`Could not disconnect. State: ${this.ws.readyState}`);
      default:
        break;
    }
    await new Promise((resolve, reject) => {
      if (this.ws) {
        this.ws.once("error", reject).once("close", resolve).close();
      } else {
        resolve();
      }
    });
  }
  /** Subscribes to the specified channel. */
  subscribe(channel) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_send
    ).call(this, { command: "subscribe", channel });
  }
  /** Unsubscribes from the specified channel. */
  unsubscribe(channel) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_send
    ).call(this, { command: "unsubscribe", channel });
  }
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
  ]) {
    return {
      subject: "ticker",
      channel_id,
      currencyPairId,
      currencyPair: currencypairs_js_1.CurrencyPairs[currencyPairId],
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen: Boolean(isFrozen),
      high24hr,
      low24hr,
    };
  }
  static formatVolume([channel_id, , [time, users, volume]]) {
    return { subject: "volume", channel_id, time, users, volume };
  }
  static formatSnapshot([, { currencyPair, orderBook }, epoch_ms]) {
    const [asks, bids] = orderBook;
    return { subject: "snapshot", currencyPair, asks, bids, epoch_ms };
  }
  static formatPublicTrade([
    ,
    tradeID,
    side,
    price,
    size,
    timestamp,
    epoch_ms,
  ]) {
    return {
      subject: "publicTrade",
      tradeID,
      type: side === 1 ? "buy" : "sell",
      price,
      size,
      timestamp,
      epoch_ms,
    };
  }
  static formatBookUpdate([, side, price, size, epoch_ms]) {
    const type = side === 1 ? "bid" : "ask";
    return { subject: "update", type, price, size, epoch_ms };
  }
  static formatHeartbeat([channel_id]) {
    return { subject: "heartbeat", channel_id };
  }
  static formatAcknowledge([channel_id, sequence]) {
    const subject = sequence ? "subscribed" : "unsubscribed";
    return { subject, channel_id };
  }
  static formatUpdate([channel_id, sequence, messages]) {
    const output = [];
    const currencyPair = currencypairs_js_1.CurrencyPairs[channel_id];
    for (const message of messages) {
      if (message[0] === "i") {
        const msg = WebSocketClient.formatSnapshot(message);
        output.push({ channel_id, sequence, ...msg });
      } else if (message[0] === "t") {
        const msg = WebSocketClient.formatPublicTrade(message);
        output.push({
          currencyPair,
          channel_id,
          sequence,
          ...msg,
        });
      } else {
        const msg = WebSocketClient.formatBookUpdate(message);
        output.push({ currencyPair, channel_id, sequence, ...msg });
      }
    }
    return output;
  }
  static formatPending([
    ,
    orderNumber,
    currencyPairId,
    rate,
    amount,
    type,
    clientOrderId,
    epoch_ms,
  ]) {
    return {
      subject: "pending",
      orderNumber,
      currencyPairId,
      currencyPair: currencypairs_js_1.CurrencyPairs[currencyPairId],
      rate,
      amount,
      type: type === "0" ? "sell" : "buy",
      clientOrderId,
      epoch_ms,
    };
  }
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
  ]) {
    return {
      subject: "new",
      currencyPairId,
      currencyPair: currencypairs_js_1.CurrencyPairs[currencyPairId],
      orderNumber,
      type: type === "0" ? "sell" : "buy",
      rate,
      amount,
      date,
      originalAmount,
      clientOrderId,
    };
  }
  static formatBalance([, currencyId, w, amount]) {
    const wallet = w === "e" ? "exchange" : w === "m" ? "margin" : "lending";
    const currency = currencies_js_1.Currencies[currencyId];
    return { subject: "balance", currencyId, currency, wallet, amount };
  }
  static formatOrder([, orderNumber, newAmount, t, clientOrderId]) {
    const subject = "order";
    const orderType =
      t === "f" ? "filled" : t === "c" ? "canceled" : "self-trade";
    return { subject, orderNumber, newAmount, orderType, clientOrderId };
  }
  static formatMarginUpdate([, orderNumber, currency, amount, clientOrderId]) {
    const subject = "margin";
    return {
      subject,
      orderNumber,
      currency: currencies_js_1.Currencies[currency] ?? `${currency}`,
      amount,
      clientOrderId,
    };
  }
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
  ]) {
    return {
      subject: "trade",
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
    };
  }
  static formatKill([, orderNumber, clientOrderId]) {
    return { subject: "killed", orderNumber, clientOrderId };
  }
  static formatAccount([channel_id, , messages]) {
    const output = [];
    for (const message of messages) {
      if (message[0] === "p") {
        const msg = WebSocketClient.formatPending(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "n") {
        const msg = WebSocketClient.formatNew(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "b") {
        const msg = WebSocketClient.formatBalance(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "o") {
        const msg = WebSocketClient.formatOrder(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "m") {
        const msg = WebSocketClient.formatMarginUpdate(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "t") {
        const msg = WebSocketClient.formatTrade(message);
        output.push({ channel_id, ...msg });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (message[0] === "k") {
        const msg = WebSocketClient.formatKill(message);
        output.push({ channel_id, ...msg });
      }
    }
    return output;
  }
  set nonce(nonce) {
    __classPrivateFieldSet(this, _WebSocketClient_nonce, nonce, "f");
  }
  get nonce() {
    return __classPrivateFieldGet(this, _WebSocketClient_nonce, "f");
  }
}
exports.WebSocketClient = WebSocketClient;
(_WebSocketClient_key = new WeakMap()),
  (_WebSocketClient_secret = new WeakMap()),
  (_WebSocketClient_nonce = new WeakMap()),
  (_WebSocketClient_instances = new WeakSet()),
  (_WebSocketClient_send = async function _WebSocketClient_send(subscription) {
    const { ws } = this;
    if (!ws) {
      throw new Error("WebSocket is not initialized");
    }
    let message = { ...subscription };
    if (
      typeof __classPrivateFieldGet(this, _WebSocketClient_key, "f") !==
        "undefined" &&
      typeof __classPrivateFieldGet(this, _WebSocketClient_secret, "f") !==
        "undefined"
    ) {
      const form = new URLSearchParams({ nonce: `${this.nonce()}` });
      const payload = form.toString();
      const signature = (0, signer_js_1.SignRequest)({
        key: __classPrivateFieldGet(this, _WebSocketClient_key, "f"),
        secret: __classPrivateFieldGet(this, _WebSocketClient_secret, "f"),
        body: payload,
      });
      message = { ...message, payload, ...signature };
    }
    await new Promise((resolve, reject) => {
      ws.send(JSON.stringify(message), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });
