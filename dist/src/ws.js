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
  _a,
  _WebSocketClient_ws_url,
  _WebSocketClient_symbol,
  _WebSocketClient_auth,
  _WebSocketClient_signTimestamp,
  _WebSocketClient_public_ws,
  _WebSocketClient_private_ws,
  _WebSocketClient_send,
  _WebSocketClient_sendSubscription,
  _WebSocketClient_ping,
  _WebSocketClient_unsubscribeAll,
  _WebSocketClient_getSubscriptions,
  _WebSocketClient_connectWS,
  _WebSocketClient_disconnectWS;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = exports.WebSocketURL = exports.WSAbort = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/method-signature-style */
const node_events_1 = require("node:events");
const ws_1 = require("ws");
const public_js_1 = require("./public.js");
const signature_js_1 = require("./signature.js");
class WSAbort extends Error {
  constructor(msg) {
    super(msg);
    this.name = "AbortError";
  }
}
exports.WSAbort = WSAbort;
exports.WebSocketURL = "wss://ws.poloniex.com/ws/";
class WebSocketClient extends node_events_1.EventEmitter {
  /** Create WebSocketClient. */
  constructor({
    ws_url = exports.WebSocketURL,
    symbol = public_js_1.DefaultSymbol,
    signTimestamp = () => Date.now().toString(),
    key,
    secret,
  } = {}) {
    super();
    _WebSocketClient_instances.add(this);
    _WebSocketClient_ws_url.set(this, void 0);
    _WebSocketClient_symbol.set(this, void 0);
    _WebSocketClient_auth.set(this, void 0);
    _WebSocketClient_signTimestamp.set(this, void 0);
    _WebSocketClient_public_ws.set(this, void 0);
    _WebSocketClient_private_ws.set(this, void 0);
    __classPrivateFieldSet(this, _WebSocketClient_ws_url, new URL(ws_url), "f");
    __classPrivateFieldSet(this, _WebSocketClient_public_ws, null, "f");
    __classPrivateFieldSet(this, _WebSocketClient_private_ws, null, "f");
    __classPrivateFieldSet(this, _WebSocketClient_symbol, symbol, "f");
    __classPrivateFieldSet(
      this,
      _WebSocketClient_signTimestamp,
      signTimestamp,
      "f"
    );
    if (typeof key === "string" && typeof secret === "string") {
      __classPrivateFieldSet(this, _WebSocketClient_auth, { key, secret }, "f");
    } else {
      __classPrivateFieldSet(this, _WebSocketClient_auth, null, "f");
    }
  }
  get symbol() {
    return __classPrivateFieldGet(this, _WebSocketClient_symbol, "f");
  }
  /** Public WebSocket */
  get public_ws() {
    return __classPrivateFieldGet(this, _WebSocketClient_public_ws, "f");
  }
  /** Private WebSocket */
  get private_ws() {
    return __classPrivateFieldGet(this, _WebSocketClient_private_ws, "f");
  }
  /** Connect to the public websocket. */
  connectPublicWS() {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_connectWS
    ).call(this, "public");
  }
  /** Connect to the private websocket. */
  connectPrivateWS() {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_connectWS
    ).call(this, "private");
  }
  /** Disconnect from the public websocket. */
  disconnectPublicWS() {
    return __classPrivateFieldGet(
      WebSocketClient,
      _a,
      "m",
      _WebSocketClient_disconnectWS
    ).call(
      WebSocketClient,
      __classPrivateFieldGet(this, _WebSocketClient_public_ws, "f")
    );
  }
  /** Disconnect from the private websocket. */
  disconnectPrivateWS() {
    return __classPrivateFieldGet(
      WebSocketClient,
      _a,
      "m",
      _WebSocketClient_disconnectWS
    ).call(
      WebSocketClient,
      __classPrivateFieldGet(this, _WebSocketClient_private_ws, "f")
    );
  }
  /** Send a ping message to the public server. */
  pingPublic({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_ping
    ).call(this, "public", { signal });
  }
  /** Send a ping message to the private server. */
  pingPrivate({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_ping
    ).call(this, "private", { signal });
  }
  /** Unsubscribe from all public channels. */
  unsubscribePublic({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_unsubscribeAll
    ).call(this, "public", { signal });
  }
  /** Unsubscribe from all public channels. */
  unsubscribePrivate({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_unsubscribeAll
    ).call(this, "private", { signal });
  }
  /** Get the list of current public subscriptions. */
  getPublicSubscriptions({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_getSubscriptions
    ).call(this, "public", { signal });
  }
  /** Get the list of current private subscriptions. */
  getPrivateSubscriptions({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_getSubscriptions
    ).call(this, "private", { signal });
  }
  /** Subscribe to the `channel` (candles). */
  subscribeCandles({
    channel,
    signal,
    symbols = [__classPrivateFieldGet(this, _WebSocketClient_symbol, "f")],
  }) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "subscribe",
      signal,
      symbols,
      channel,
    });
  }
  /** Unsubscribe from the `channel` (candles). */
  unsubscribeCandles({
    channel,
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  }) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", { event: "unsubscribe", signal, symbols, channel });
  }
  /** Subscribe to the `trades` channel. */
  subscribeTrades({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "trades",
    });
  }
  /** Unsubscribe from the `trades` channel. */
  unsubscribeTrades({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "trades",
    });
  }
  /** Subscribe to the `ticker` channel. */
  subscribeTicker({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "ticker",
    });
  }
  /** Unsubscribe from the `ticker` channel. */
  unsubscribeTicker({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "ticker",
    });
  }
  /** Subscribe to the `book` channel. */
  subscribeBook({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
    depth = 5,
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "book",
      data: { depth },
    });
  }
  /** Unsubscribe from the `book` channel. */
  unsubscribeBook({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "book",
    });
  }
  /** Subscribe to the `book_lv2` channel. */
  subscribeLv2Book({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "book_lv2",
    });
  }
  /** Unsubscribe from the `book_lv2` channel. */
  unsubscribeLv2Book({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "book_lv2",
    });
  }
  /** Authenticate to the private websocket. */
  async auth({ signal } = {}) {
    if (!__classPrivateFieldGet(this, _WebSocketClient_auth, "f")) {
      throw new Error("Auth credintials are missing");
    }
    const signTimestamp = __classPrivateFieldGet(
      this,
      _WebSocketClient_signTimestamp,
      "f"
    ).call(this);
    const searchParams = new URLSearchParams({ signTimestamp });
    const path = "/ws";
    const method = "GET";
    const params = (0, signature_js_1.signature)({
      method,
      searchParams,
      signTimestamp,
      path,
      key: __classPrivateFieldGet(this, _WebSocketClient_auth, "f").key,
      secret: __classPrivateFieldGet(this, _WebSocketClient_auth, "f").secret,
    });
    const payload = { event: "subscribe", channel: ["auth"], params };
    const predicate = (message) =>
      "channel" in message && message.channel === "auth";
    const result = await __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_send
    ).call(this, "private", payload, { predicate, signal });
    if (!result.data.success) {
      throw new Error(result.data.message);
    }
    return result;
  }
  /** Subscribe to the `orders` channel. */
  subscribeOrders({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "private", {
      event: "subscribe",
      signal,
      symbols,
      channel: "orders",
    });
  }
  /** Unsubscribe from the `orders` channel. */
  unsubscribeOrders({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "private", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "orders",
    });
  }
  /** Subscribe to the `balances` channel. */
  subscribeBalances({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "private", {
      event: "subscribe",
      signal,
      channel: "balances",
    });
  }
  /** Unsubscribe from the `balances` channel. */
  unsubscribeBalances({ signal } = {}) {
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_sendSubscription
    ).call(this, "private", {
      event: "unsubscribe",
      signal,
      channel: "balances",
    });
  }
  async *candles({ channel, signal, symbols = this.symbol }) {
    await this.subscribeCandles({ channel, signal, symbols });
    const predicate = (message) =>
      "channel" in message && message.channel === channel && "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "public", null, { predicate, signal });
    }
  }
  async *trades({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    await this.subscribeTrades({ signal, symbols });
    const predicate = (message) =>
      "channel" in message && message.channel === "trades" && "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "public", null, { predicate, signal });
    }
  }
  async *tickers({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    await this.subscribeTicker({ signal, symbols });
    const predicate = (message) =>
      "channel" in message && message.channel === "ticker" && "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "public", null, { predicate, signal });
    }
  }
  async *books({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
    depth = 5,
  } = {}) {
    await this.subscribeBook({ signal, symbols, depth });
    const predicate = (message) =>
      "channel" in message && message.channel === "book" && "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "public", null, { predicate, signal });
    }
  }
  async *booksLv2({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    await this.subscribeLv2Book({ signal, symbols });
    const predicate = (message) =>
      "channel" in message &&
      message.channel === "book_lv2" &&
      "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "public", null, { predicate, signal });
    }
  }
  async *orders({
    signal,
    symbols = __classPrivateFieldGet(this, _WebSocketClient_symbol, "f"),
  } = {}) {
    await this.subscribeOrders({ signal, symbols });
    const predicate = (message) =>
      "channel" in message && message.channel === "orders" && "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "private", null, { predicate, signal });
    }
  }
  async *balances({ signal } = {}) {
    await this.subscribeBalances({ signal });
    const predicate = (message) =>
      "channel" in message &&
      message.channel === "balances" &&
      "data" in message;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, "private", null, {
        predicate,
        signal,
      });
    }
  }
  /** Send a message to the WebSocket server */
  send(payload, type) {
    const ws =
      type === "private"
        ? __classPrivateFieldGet(this, _WebSocketClient_private_ws, "f")
        : __classPrivateFieldGet(this, _WebSocketClient_public_ws, "f");
    if (!ws) {
      return Promise.reject(new Error("Websocket is not connected"));
    }
    return new Promise((resolve, reject) => {
      ws.send(JSON.stringify(payload), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
exports.WebSocketClient = WebSocketClient;
(_a = WebSocketClient),
  (_WebSocketClient_ws_url = new WeakMap()),
  (_WebSocketClient_symbol = new WeakMap()),
  (_WebSocketClient_auth = new WeakMap()),
  (_WebSocketClient_signTimestamp = new WeakMap()),
  (_WebSocketClient_public_ws = new WeakMap()),
  (_WebSocketClient_private_ws = new WeakMap()),
  (_WebSocketClient_instances = new WeakSet()),
  (_WebSocketClient_send = function _WebSocketClient_send(
    type,
    payload,
    { predicate, signal }
  ) {
    return new Promise((resolve, reject) => {
      const ws =
        type === "private"
          ? __classPrivateFieldGet(this, _WebSocketClient_private_ws, "f")
          : __classPrivateFieldGet(this, _WebSocketClient_public_ws, "f");
      if (!ws) {
        reject(new Error("Websocket is not connected"));
        return;
      }
      const aborted = signal?.aborted ?? false;
      const use_abort = signal instanceof AbortSignal && !aborted;
      const listeners = {
        message: (message, ws_type) => {
          if (ws_type === type && predicate(message)) {
            listeners.remove_listeners();
            resolve(message);
          }
        },
        close: (ws_type) => {
          if (ws_type === type) {
            listeners.remove_listeners();
            reject(new Error("WebSocket connection has been closed"));
          }
        },
        error: (error, ws_type) => {
          if (ws_type === type) {
            listeners.remove_listeners();
            reject(error);
          }
        },
        abort: () => {
          listeners.remove_listeners();
          reject(new WSAbort("The request has been aborted"));
        },
        add_listeners: () => {
          this.on("error", listeners.error)
            .on("close", listeners.close)
            .on("message", listeners.message);
        },
        remove_listeners: () => {
          this.off("message", listeners.message)
            .off("error", listeners.error)
            .off("close", listeners.close);
          if (use_abort) {
            signal.removeEventListener("abort", listeners.abort);
          }
        },
      };
      if (use_abort) {
        signal.addEventListener("abort", listeners.abort, { once: true });
      }
      if (payload) {
        ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            if (use_abort) {
              signal.removeEventListener("abort", listeners.abort);
            }
            reject(error);
          } else if (!use_abort || !signal.aborted) {
            listeners.add_listeners();
          }
        });
      } else {
        listeners.add_listeners();
      }
    });
  }),
  (_WebSocketClient_sendSubscription =
    function _WebSocketClient_sendSubscription(
      type,
      { event, channel, signal, symbols, data = {} }
    ) {
      const predicate = (message) =>
        "event" in message &&
        message.event === event &&
        message.channel === channel;
      const payload = {
        event,
        channel: [channel],
        ...data,
      };
      if (typeof symbols !== "undefined") {
        payload.symbols = Array.isArray(symbols) ? symbols : [symbols];
      }
      return __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, type, payload, { predicate, signal });
    }),
  (_WebSocketClient_ping = function _WebSocketClient_ping(
    type,
    { signal } = {}
  ) {
    const msg = { event: "ping" };
    const predicate = (message) =>
      "event" in message && message.event === "pong";
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_send
    ).call(this, type, msg, { predicate, signal });
  }),
  (_WebSocketClient_unsubscribeAll = function _WebSocketClient_unsubscribeAll(
    type,
    { signal } = {}
  ) {
    const msg = { event: "unsubscribe_all" };
    const predicate = (message) =>
      "event" in message && message.event === "unsubscribe_all";
    return __classPrivateFieldGet(
      this,
      _WebSocketClient_instances,
      "m",
      _WebSocketClient_send
    ).call(this, type, msg, { predicate, signal });
  }),
  (_WebSocketClient_getSubscriptions =
    function _WebSocketClient_getSubscriptions(type, { signal } = {}) {
      const msg = { event: "list_subscriptions" };
      const predicate = (message) => "subscriptions" in message;
      return __classPrivateFieldGet(
        this,
        _WebSocketClient_instances,
        "m",
        _WebSocketClient_send
      ).call(this, type, msg, { predicate, signal });
    }),
  (_WebSocketClient_connectWS = function _WebSocketClient_connectWS(type) {
    const ws =
      type === "private"
        ? __classPrivateFieldGet(this, _WebSocketClient_private_ws, "f")
        : __classPrivateFieldGet(this, _WebSocketClient_public_ws, "f");
    const url = new URL(
      type,
      __classPrivateFieldGet(this, _WebSocketClient_ws_url, "f").toString()
    );
    switch (ws?.readyState) {
      case ws_1.WebSocket.CLOSING:
      case ws_1.WebSocket.CONNECTING:
        return Promise.reject(
          new Error(`Could not connect. State: ${ws.readyState}`)
        );
      case ws_1.WebSocket.OPEN:
        return Promise.resolve();
      default:
        break;
    }
    return new Promise((resolve, reject) => {
      const socket = new ws_1.WebSocket(url)
        .once("open", resolve)
        .once("error", reject)
        .on("open", () => {
          this.emit("open", type);
        })
        .once("close", () => {
          this.emit("close", type);
        })
        .on("message", (data) => {
          try {
            const jsondata = JSON.parse(data);
            if ("event" in jsondata && jsondata.event === "error") {
              this.emit("error", new Error(jsondata.message), type);
              return;
            }
            this.emit("message", jsondata, type);
          } catch (error) {
            this.emit(
              "error",
              new Error("Message count not be parsed by `JSON.parse`"),
              type
            );
          }
        })
        .on("error", (error) => {
          if (typeof error !== "undefined") {
            this.emit("error", error, type);
          }
        });
      if (type === "private") {
        __classPrivateFieldSet(this, _WebSocketClient_private_ws, socket, "f");
      } else {
        __classPrivateFieldSet(this, _WebSocketClient_public_ws, socket, "f");
      }
    });
  }),
  (_WebSocketClient_disconnectWS = function _WebSocketClient_disconnectWS(ws) {
    if (!ws) {
      return Promise.resolve();
    }
    switch (ws.readyState) {
      case ws_1.WebSocket.CLOSED:
        return Promise.resolve();
      case ws_1.WebSocket.CLOSING:
      case ws_1.WebSocket.CONNECTING:
        return Promise.reject(
          new Error(`Could not disconnect. State: ${ws.readyState}`)
        );
      default:
        break;
    }
    return new Promise((resolve, reject) => {
      const listeners = {
        close: () => {
          ws.off("error", listeners.error);
          resolve();
        },
        error: (error) => {
          ws.off("close", listeners.close);
          reject(error);
        },
      };
      ws.once("error", listeners.error).once("close", listeners.close).close();
    });
  });
