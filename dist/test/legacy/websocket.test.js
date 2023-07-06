"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const index_js_1 = require("../../src/legacy/index.js");
const ws_1 = require("ws");
const port = 10010;
const wsUri = `ws://localhost:${port}`;
suite("WebSocketClient", () => {
  // eslint-disable-next-line init-declarations
  let client;
  // eslint-disable-next-line init-declarations
  let server;
  setup(() => {
    server = new ws_1.WebSocketServer({ port });
    client = new index_js_1.WebSocketClient({ wsUri });
  });
  teardown(async () => {
    server.clients.forEach((c) => {
      c.close();
    });
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });
  test("constructor", () => {
    const key = "poloniexapikey";
    const secret = "poloniexapisecret";
    const channels = [];
    const raw = false;
    const websocket = new index_js_1.WebSocketClient({
      key,
      secret,
      raw,
      channels,
    });
    (0, node_assert_1.deepStrictEqual)(websocket.channels, channels);
    (0, node_assert_1.deepStrictEqual)(websocket.wsUri, index_js_1.WsUri);
    (0, node_assert_1.deepStrictEqual)(websocket.raw, raw);
  });
  test(".nonce()", () => {
    const nonce = client.nonce();
    (0, node_assert_1.ok)(Date.now() - nonce < 10);
  });
  test("constructor (with no arguments)", () => {
    const websocket = new index_js_1.WebSocketClient();
    (0, node_assert_1.deepStrictEqual)(
      websocket.channels,
      index_js_1.DefaultChannels
    );
    (0, node_assert_1.deepStrictEqual)(websocket.wsUri, index_js_1.WsUri);
    (0, node_assert_1.deepStrictEqual)(websocket.raw, true);
  });
  test(".connect() (subscribes to the default channel)", async () => {
    (0, node_assert_1.deepStrictEqual)(client.wsUri, wsUri);
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws) => {
        ws.once("message", (data) => {
          try {
            const [channel] = index_js_1.DefaultChannels;
            const command = "subscribe";
            (0, node_assert_1.deepStrictEqual)(JSON.parse(data), {
              command,
              channel,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await connection;
  });
  test(".connect() (when `readyState` is `OPEN`)", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connect() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connect();
    const error = new Error("Could not connect. State: 0");
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.CONNECTING
    );
    await (0, node_assert_1.rejects)(client.connect(), error);
    await connect;
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connect() (when `readyState` is `CLOSING`)", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    const disconnect = client.disconnect();
    const error = new Error("Could not connect. State: 2");
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSING
    );
    await (0, node_assert_1.rejects)(client.connect(), error);
    await disconnect;
  });
  test(".connect() (when `readyState` is `CLOSED`)", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSED
    );
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".disconnect()", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".disconnect() (when socket is not initialized)", async () => {
    (0, node_assert_1.ok)(typeof client.ws === "undefined");
    await client.disconnect();
    (0, node_assert_1.ok)(typeof client.ws === "undefined");
  });
  test(".disconnect() (when `readyState` is `CLOSED`)", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSED
    );
    await client.disconnect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".disconnect() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connect();
    const error = new Error("Could not disconnect. State: 0");
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.CONNECTING
    );
    await (0, node_assert_1.rejects)(client.disconnect(), error);
    await connect;
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".disconnect() (when `readyState` is `CLOSING`)", async () => {
    await client.connect();
    (0, node_assert_1.deepStrictEqual)(
      client.ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    const disconnect = client.disconnect();
    const error = new Error("Could not disconnect. State: 2");
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSING
    );
    await (0, node_assert_1.rejects)(client.disconnect(), error);
    await disconnect;
    (0, node_assert_1.deepStrictEqual)(
      client.ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".subscribe()", async () => {
    const channelToSubscribe = 1003;
    const [channel] = index_js_1.DefaultChannels;
    const connection = new Promise((resolve) => {
      server.once("connection", (ws) => {
        const command = "subscribe";
        ws.once("message", (message) => {
          (0, node_assert_1.deepStrictEqual)(JSON.parse(message), {
            command,
            channel,
          });
          ws.once("message", (data) => {
            (0, node_assert_1.deepStrictEqual)(JSON.parse(data), {
              command,
              channel: channelToSubscribe,
            });
            resolve();
          });
        });
      });
    });
    await client.connect();
    await client.subscribe(channelToSubscribe);
    await connection;
  });
  test(".subscribe() (when WebSocket is not open)", async () => {
    const message = "WebSocket is not open: readyState 3 (CLOSED)";
    await client.connect();
    await client.disconnect();
    await (0, node_assert_1.rejects)(
      client.subscribe(1000),
      new Error(message)
    );
  });
  test(".subscribe() (when `socket` is not initialized)", async () => {
    const error = new Error("WebSocket is not initialized");
    await (0, node_assert_1.rejects)(client.subscribe(1002), error);
  });
  test(".unsubscribe()", async () => {
    const [channel] = index_js_1.DefaultChannels;
    const connection = new Promise((resolve) => {
      server.once("connection", (ws) => {
        const command = "subscribe";
        ws.once("message", (message) => {
          (0, node_assert_1.deepStrictEqual)(JSON.parse(message), {
            command,
            channel,
          });
          ws.once("message", (data) => {
            (0, node_assert_1.deepStrictEqual)(JSON.parse(data), {
              command: "unsubscribe",
              channel,
            });
            resolve();
          });
        });
      });
    });
    await client.connect();
    await client.unsubscribe(channel);
    await connection;
  });
  test(".unsubscribe() (when WebSocket is not open)", async () => {
    const key = "poloniex-api-key";
    const secret = "poloniex-api-secret";
    const message = "WebSocket is not open: readyState 3 (CLOSED)";
    const authClient = new index_js_1.WebSocketClient({ wsUri, key, secret });
    const nonce = 1;
    authClient.nonce = () => nonce;
    await authClient.connect();
    await authClient.disconnect();
    await (0, node_assert_1.rejects)(
      authClient.unsubscribe(1000),
      new Error(message)
    );
  });
  suite("Formatters", () => {
    test(".formatTicker()", () => {
      const rawTicker = [
        1002,
        null,
        [
          150,
          "0.00000098",
          "0.00000099",
          "0.00000098",
          "0.01030927",
          "23.24910068",
          "23685243.40788439",
          0,
          "0.00000100",
          "0.00000096",
        ],
      ];
      const expectedTicker = {
        subject: "ticker",
        channel_id: 1002,
        currencyPairId: 150,
        currencyPair: "BTC_SC",
        last: "0.00000098",
        lowestAsk: "0.00000099",
        highestBid: "0.00000098",
        percentChange: "0.01030927",
        baseVolume: "23.24910068",
        quoteVolume: "23685243.40788439",
        isFrozen: false,
        high24hr: "0.00000100",
        low24hr: "0.00000096",
      };
      const ticker = index_js_1.WebSocketClient.formatTicker(rawTicker);
      (0, node_assert_1.deepStrictEqual)(ticker, expectedTicker);
    });
    test(".formatTicker() (`isFrozen` is true)", () => {
      const rawTicker = [
        1002,
        null,
        [
          150,
          "0.00000098",
          "0.00000099",
          "0.00000098",
          "0.01030927",
          "23.24910068",
          "23685243.40788439",
          1,
          "0.00000100",
          "0.00000096",
        ],
      ];
      const expectedTicker = {
        subject: "ticker",
        channel_id: 1002,
        currencyPairId: 150,
        currencyPair: "BTC_SC",
        last: "0.00000098",
        lowestAsk: "0.00000099",
        highestBid: "0.00000098",
        percentChange: "0.01030927",
        baseVolume: "23.24910068",
        quoteVolume: "23685243.40788439",
        isFrozen: true,
        high24hr: "0.00000100",
        low24hr: "0.00000096",
      };
      const ticker = index_js_1.WebSocketClient.formatTicker(rawTicker);
      (0, node_assert_1.deepStrictEqual)(ticker, expectedTicker);
    });
    test(".formatVolume()", () => {
      const rawVolume = [
        1003,
        null,
        [
          "2018-11-07 16:26",
          5804,
          {
            BTC: "3418.409",
            ETH: "2645.921",
            USDT: "10832502.689",
            USDC: "1578020.908",
          },
        ],
      ];
      const expectedVolume = {
        subject: "volume",
        channel_id: 1003,
        time: "2018-11-07 16:26",
        users: 5804,
        volume: {
          BTC: "3418.409",
          ETH: "2645.921",
          USDT: "10832502.689",
          USDC: "1578020.908",
        },
      };
      const volume = index_js_1.WebSocketClient.formatVolume(rawVolume);
      (0, node_assert_1.deepStrictEqual)(volume, expectedVolume);
    });
    test(".formatSnapshot()", () => {
      const rawSnapshot = [
        "i",
        {
          currencyPair: "BTC_ETH",
          orderBook: [
            {
              "0.03119500": "8.87619723",
              0.03120486: "2.15539849",
              "0.03120500": "50.78890000",
              "3777.70000000": "0.00100000",
              "4999.00000000": "0.05000000",
              "5000.00000000": "0.20000000",
            },
            {
              "0.03118500": "50.78940000",
              0.03117855: "10.55121501",
              0.03117841: "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000",
            },
          ],
        },
        "1580123594000",
      ];
      const expectedSnapshot = {
        subject: "snapshot",
        currencyPair: "BTC_ETH",
        asks: {
          "0.03119500": "8.87619723",
          0.03120486: "2.15539849",
          "0.03120500": "50.78890000",
          "3777.70000000": "0.00100000",
          "4999.00000000": "0.05000000",
          "5000.00000000": "0.20000000",
        },
        bids: {
          "0.03118500": "50.78940000",
          0.03117855: "10.55121501",
          0.03117841: "6.20027213",
          "0.00000003": "20000.00000000",
          "0.00000002": "670207.00000000",
          "0.00000001": "1462262.00000000",
        },
        epoch_ms: "1580123594000",
      };
      const snapshot = index_js_1.WebSocketClient.formatSnapshot(rawSnapshot);
      (0, node_assert_1.deepStrictEqual)(snapshot, expectedSnapshot);
    });
    test(".formatPublicTrade() (buy)", () => {
      const rawTrade = [
        "t",
        "48555788",
        1,
        "0.01924381",
        "0.60000000",
        1580123594,
        "1580123594000",
      ];
      const expectedTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "buy",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594,
        epoch_ms: "1580123594000",
      };
      const trade = index_js_1.WebSocketClient.formatPublicTrade(rawTrade);
      (0, node_assert_1.deepStrictEqual)(trade, expectedTrade);
    });
    test(".formatPublicTrade() (sell)", () => {
      const rawTrade = [
        "t",
        "48555788",
        0,
        "0.01924381",
        "0.60000000",
        1580123594,
        "1580123594000",
      ];
      const expectedTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "sell",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594,
        epoch_ms: "1580123594000",
      };
      const trade = index_js_1.WebSocketClient.formatPublicTrade(rawTrade);
      (0, node_assert_1.deepStrictEqual)(trade, expectedTrade);
    });
    test(".formatBookUpdate() (bid)", () => {
      const rawUpdate = ["o", 1, "0.01924381", "0.00000000", "1580123594000"];
      const expectedUpdate = {
        subject: "update",
        type: "bid",
        price: "0.01924381",
        size: "0.00000000",
        epoch_ms: "1580123594000",
      };
      const update = index_js_1.WebSocketClient.formatBookUpdate(rawUpdate);
      (0, node_assert_1.deepStrictEqual)(update, expectedUpdate);
    });
    test(".formatBookUpdate() (ask)", () => {
      const rawUpdate = ["o", 0, "0.01924381", "0.00000000", "1580123594000"];
      const expectedUpdate = {
        subject: "update",
        type: "ask",
        price: "0.01924381",
        size: "0.00000000",
        epoch_ms: "1580123594000",
      };
      const update = index_js_1.WebSocketClient.formatBookUpdate(rawUpdate);
      (0, node_assert_1.deepStrictEqual)(update, expectedUpdate);
    });
    test(".formatHeartbeat()", () => {
      const rawHeartbeat = [1010];
      const expectedHeartbeat = {
        subject: "heartbeat",
        channel_id: 1010,
      };
      const heartbeat =
        index_js_1.WebSocketClient.formatHeartbeat(rawHeartbeat);
      (0, node_assert_1.deepStrictEqual)(heartbeat, expectedHeartbeat);
    });
    test(".formatAcknowledge() (subscribe)", () => {
      const rawAcknowledge = [1002, 1];
      const expectedAcknowledge = {
        subject: "subscribed",
        channel_id: 1002,
      };
      const acknowledge =
        index_js_1.WebSocketClient.formatAcknowledge(rawAcknowledge);
      (0, node_assert_1.deepStrictEqual)(acknowledge, expectedAcknowledge);
    });
    test(".formatAcknowledge() (unsubscribed)", () => {
      const rawAcknowledge = [1002, 0];
      const expectedAcknowledge = {
        subject: "unsubscribed",
        channel_id: 1002,
      };
      const acknowledge =
        index_js_1.WebSocketClient.formatAcknowledge(rawAcknowledge);
      (0, node_assert_1.deepStrictEqual)(acknowledge, expectedAcknowledge);
    });
    test(".formatUpdate()", () => {
      const rawPriceAggregatedBook = [
        148,
        818973992,
        [
          [
            "i",
            {
              currencyPair: "BTC_ETH",
              orderBook: [
                {
                  "0.03119500": "8.87619723",
                  0.03120486: "2.15539849",
                  "0.03120500": "50.78890000",
                  "3777.70000000": "0.00100000",
                  "4999.00000000": "0.05000000",
                  "5000.00000000": "0.20000000",
                },
                {
                  "0.03118500": "50.78940000",
                  0.03117855: "10.55121501",
                  0.03117841: "6.20027213",
                  "0.00000003": "20000.00000000",
                  "0.00000002": "670207.00000000",
                  "0.00000001": "1462262.00000000",
                },
              ],
            },
            "1580123594000",
          ],
          ["o", 1, "0.01924381", "0.00000000", "1580123594000"],
          [
            "t",
            "48555788",
            0,
            "0.01924381",
            "0.60000000",
            1580123594,
            "1580123594000",
          ],
        ],
      ];
      const expectedMessages = [
        {
          channel_id: 148,
          sequence: 818973992,
          subject: "snapshot",
          currencyPair: "BTC_ETH",
          asks: {
            "0.03119500": "8.87619723",
            0.03120486: "2.15539849",
            "0.03120500": "50.78890000",
            "3777.70000000": "0.00100000",
            "4999.00000000": "0.05000000",
            "5000.00000000": "0.20000000",
          },
          bids: {
            "0.03118500": "50.78940000",
            0.03117855: "10.55121501",
            0.03117841: "6.20027213",
            "0.00000003": "20000.00000000",
            "0.00000002": "670207.00000000",
            "0.00000001": "1462262.00000000",
          },
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 148,
          sequence: 818973992,
          currencyPair: "BTC_ETH",
          subject: "update",
          type: "bid",
          price: "0.01924381",
          size: "0.00000000",
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 148,
          sequence: 818973992,
          currencyPair: "BTC_ETH",
          subject: "publicTrade",
          tradeID: "48555788",
          type: "sell",
          price: "0.01924381",
          size: "0.60000000",
          timestamp: 1580123594,
          epoch_ms: "1580123594000",
        },
      ];
      const messages = index_js_1.WebSocketClient.formatUpdate(
        rawPriceAggregatedBook
      );
      (0, node_assert_1.deepStrictEqual)(messages, expectedMessages);
    });
    test(".formatPending() (buy)", () => {
      const rawPending = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "1",
        null,
        "1580123594000",
      ];
      const expectedPending = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "buy",
        clientOrderId: null,
        epoch_ms: "1580123594000",
      };
      const pending = index_js_1.WebSocketClient.formatPending(rawPending);
      (0, node_assert_1.deepStrictEqual)(pending, expectedPending);
    });
    test(".formatPending() (sell)", () => {
      const rawPending = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "0",
        null,
        "1580123594000",
      ];
      const expectedPending = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "sell",
        clientOrderId: null,
        epoch_ms: "1580123594000",
      };
      const pending = index_js_1.WebSocketClient.formatPending(rawPending);
      (0, node_assert_1.deepStrictEqual)(pending, expectedPending);
    });
    test(".formatNew() (buy)", () => {
      const rawNew = [
        "n",
        203,
        123212321,
        "1",
        "999.00000000",
        "1.00000000",
        "2020-01-27 11:33:21",
        "1.00000000",
        null,
      ];
      const expectedNew = {
        subject: "new",
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        orderNumber: 123212321,
        type: "buy",
        rate: "999.00000000",
        amount: "1.00000000",
        date: "2020-01-27 11:33:21",
        originalAmount: "1.00000000",
        clientOrderId: null,
      };
      const newOrder = index_js_1.WebSocketClient.formatNew(rawNew);
      (0, node_assert_1.deepStrictEqual)(newOrder, expectedNew);
    });
    test(".formatNew() (sell)", () => {
      const rawNew = [
        "n",
        203,
        123212321,
        "0",
        "999.00000000",
        "1.00000000",
        "2020-01-27 11:33:21",
        "1.00000000",
        null,
      ];
      const expectedNew = {
        subject: "new",
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        orderNumber: 123212321,
        type: "sell",
        rate: "999.00000000",
        amount: "1.00000000",
        date: "2020-01-27 11:33:21",
        originalAmount: "1.00000000",
        clientOrderId: null,
      };
      const newOrder = index_js_1.WebSocketClient.formatNew(rawNew);
      (0, node_assert_1.deepStrictEqual)(newOrder, expectedNew);
    });
    test(".formatBalance() (exchange)", () => {
      const rawBalance = ["b", 298, "e", "-1.00000000"];
      const expectedBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "exchange",
        amount: "-1.00000000",
      };
      const balance = index_js_1.WebSocketClient.formatBalance(rawBalance);
      (0, node_assert_1.deepStrictEqual)(balance, expectedBalance);
    });
    test(".formatBalance() (margin)", () => {
      const rawBalance = ["b", 298, "m", "-1.00000000"];
      const expectedBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "margin",
        amount: "-1.00000000",
      };
      const balance = index_js_1.WebSocketClient.formatBalance(rawBalance);
      (0, node_assert_1.deepStrictEqual)(balance, expectedBalance);
    });
    test(".formatBalance() (lending)", () => {
      const rawBalance = ["b", 298, "l", "-1.00000000"];
      const expectedBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "lending",
        amount: "-1.00000000",
      };
      const balance = index_js_1.WebSocketClient.formatBalance(rawBalance);
      (0, node_assert_1.deepStrictEqual)(balance, expectedBalance);
    });
    test(".formatOrder() (canceled)", () => {
      const rawOrder = ["o", 123321123, "0.00000000", "c", null];
      const expectedOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "canceled",
        clientOrderId: null,
      };
      const order = index_js_1.WebSocketClient.formatOrder(rawOrder);
      (0, node_assert_1.deepStrictEqual)(order, expectedOrder);
    });
    test(".formatOrder() (filled)", () => {
      const rawOrder = ["o", 123321123, "0.00000000", "f", null];
      const expectedOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "filled",
        clientOrderId: null,
      };
      const order = index_js_1.WebSocketClient.formatOrder(rawOrder);
      (0, node_assert_1.deepStrictEqual)(order, expectedOrder);
    });
    test(".formatOrder() (self-trade)", () => {
      const rawOrder = ["o", 123321123, "0.00000000", "s", "123"];
      const expectedOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "self-trade",
        clientOrderId: "123",
      };
      const order = index_js_1.WebSocketClient.formatOrder(rawOrder);
      (0, node_assert_1.deepStrictEqual)(order, expectedOrder);
    });
    test(".formatMarginUpdate()", () => {
      const rawUpdate = ["m", 23432933, 28, "-0.06000000", null];
      const expectedUpdate = {
        subject: "margin",
        orderNumber: 23432933,
        currency: index_js_1.Currencies[28],
        amount: "-0.06000000",
        clientOrderId: null,
      };
      const update = index_js_1.WebSocketClient.formatMarginUpdate(rawUpdate);
      (0, node_assert_1.deepStrictEqual)(update, expectedUpdate);
    });
    test(".formatTrade()", () => {
      const rawTrade = [
        "t",
        12345,
        "0.03000000",
        "0.50000000",
        "0.00250000",
        0,
        6083059,
        "0.00000375",
        "2018-09-08 05:54:09",
        "12345",
        "0",
        "1580123594000",
      ];
      const expectedTrade = {
        subject: "trade",
        tradeID: 12345,
        rate: "0.03000000",
        amount: "0.50000000",
        feeMultiplier: "0.00250000",
        fundingType: 0,
        orderNumber: 6083059,
        fee: "0.00000375",
        date: "2018-09-08 05:54:09",
        clientOrderId: "12345",
        total_trade: "0",
        epoch_ms: "1580123594000",
      };
      const trade = index_js_1.WebSocketClient.formatTrade(rawTrade);
      (0, node_assert_1.deepStrictEqual)(trade, expectedTrade);
    });
    test(".formatKill()", () => {
      const rawKill = ["k", 12345, null];
      const expectedKill = {
        subject: "killed",
        orderNumber: 12345,
        clientOrderId: null,
      };
      const kill = index_js_1.WebSocketClient.formatKill(rawKill);
      (0, node_assert_1.deepStrictEqual)(kill, expectedKill);
    });
    test(".formatAccount()", () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const unnkownmessage = ["unnkownmessage"];
      const rawAccountMessage = [
        1000,
        "",
        [
          [
            "p",
            78612171341,
            203,
            "1000.00000000",
            "1.00000000",
            "1",
            null,
            "1580123594000",
          ],
          [
            "n",
            203,
            123212321,
            "1",
            "999.00000000",
            "1.00000000",
            "2020-01-27 11:33:21",
            "1.00000000",
            null,
          ],
          ["b", 298, "m", "-1.00000000"],
          ["o", 123321123, "0.00000000", "c", null],
          [
            "t",
            12345,
            "0.03000000",
            "0.50000000",
            "0.00250000",
            0,
            6083059,
            "0.00000375",
            "2018-09-08 05:54:09",
            "12345",
            "0",
            "1580123594000",
          ],
          ["k", 12345, null],
          unnkownmessage,
        ],
      ];
      const expectedMessages = [
        {
          channel_id: 1000,
          subject: "pending",
          orderNumber: 78612171341,
          currencyPairId: 203,
          currencyPair: "USDT_EOS",
          rate: "1000.00000000",
          amount: "1.00000000",
          type: "buy",
          clientOrderId: null,
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 1000,
          subject: "new",
          currencyPairId: 203,
          currencyPair: "USDT_EOS",
          orderNumber: 123212321,
          type: "buy",
          rate: "999.00000000",
          amount: "1.00000000",
          date: "2020-01-27 11:33:21",
          originalAmount: "1.00000000",
          clientOrderId: null,
        },
        {
          channel_id: 1000,
          subject: "balance",
          currencyId: 298,
          currency: "EOS",
          wallet: "margin",
          amount: "-1.00000000",
        },
        {
          channel_id: 1000,
          subject: "order",
          orderNumber: 123321123,
          newAmount: "0.00000000",
          orderType: "canceled",
          clientOrderId: null,
        },
        {
          channel_id: 1000,
          subject: "trade",
          tradeID: 12345,
          rate: "0.03000000",
          amount: "0.50000000",
          feeMultiplier: "0.00250000",
          fundingType: 0,
          orderNumber: 6083059,
          fee: "0.00000375",
          date: "2018-09-08 05:54:09",
          clientOrderId: "12345",
          total_trade: "0",
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 1000,
          subject: "killed",
          orderNumber: 12345,
          clientOrderId: null,
        },
      ];
      const messages =
        index_js_1.WebSocketClient.formatAccount(rawAccountMessage);
      (0, node_assert_1.deepStrictEqual)(messages, expectedMessages);
    });
  });
  suite("socket events", () => {
    suite("open", () => {
      test("emits `open`", async () => {
        const connect = new Promise((resolve) => {
          client.once("open", () => {
            resolve();
          });
        });
        await client.connect();
        await connect;
      });
      test("emits `error` when a subscribe promise rejects", async () => {
        await client.connect();
        await client.disconnect();
        const message = "WebSocket is not open: readyState 3 (CLOSED)";
        const errorPromise = new Promise((resolve, reject) => {
          client.once("error", (err) => {
            try {
              (0, node_assert_1.deepStrictEqual)(err, new Error(message));
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        (0, node_assert_1.deepStrictEqual)(client.ws?.emit("open"), true);
        await errorPromise;
      });
      test("subscribes to the channels", async () => {
        const channels = [1000, 1003];
        const otherClient = new index_js_1.WebSocketClient({ wsUri, channels });
        const connection = new Promise((resolve, reject) => {
          server.once("connection", (ws) => {
            const command = "subscribe";
            ws.once("message", (data) => {
              ws.once("message", (otherData) => {
                try {
                  const channel = 1003;
                  (0, node_assert_1.deepStrictEqual)(JSON.parse(otherData), {
                    command,
                    channel,
                  });
                  resolve();
                } catch (error) {
                  reject(error);
                }
              });
              const channel = 1000;
              try {
                (0, node_assert_1.deepStrictEqual)(JSON.parse(data), {
                  command,
                  channel,
                });
              } catch (error) {
                reject(error);
              }
            });
          });
        });
        await otherClient.connect();
        await connection;
      });
    });
    suite("close", () => {
      test("emits `close`", async () => {
        client.once("open", () => {
          client.ws?.emit("close");
        });
        const close = new Promise((resolve) => {
          client.once("close", () => {
            resolve();
          });
        });
        await client.connect();
        await close;
      });
    });
    suite("message", () => {
      test("emits `error` when receiving an error message", async () => {
        const error = "Permission denied.";
        server.once("connection", (ws) => {
          ws.send(JSON.stringify({ error }));
        });
        const errorPromise = new Promise((resolve, reject) => {
          client.once("error", (data) => {
            try {
              (0, node_assert_1.deepStrictEqual)(data, { error });
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
        await client.connect();
        await errorPromise;
      });
      test("emits `error` when receiving an invalid JSON message", async () => {
        const error = "Permission denied.";
        server.once("connection", (ws) => {
          ws.send(error);
        });
        const errorPromise = new Promise((resolve, reject) => {
          client.once("error", (data) => {
            try {
              (0, node_assert_1.ok)(data instanceof SyntaxError);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
        await client.connect();
        await errorPromise;
      });
      test("emits `rawMessage`", async () => {
        const rawMessage = [1010];
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawMessage));
        });
        const raw = new Promise((resolve) => {
          client.once("rawMessage", () => {
            client.once("message", () => {
              resolve();
            });
          });
        });
        await client.connect();
        await raw;
      });
      test("does not emit `rawMessage` (when `raw=false`)", async () => {
        const otherClient = new index_js_1.WebSocketClient({
          wsUri,
          raw: false,
        });
        const rawMessage = [1010];
        const raw = new Promise((resolve, reject) => {
          otherClient.once("rawMessage", () => {
            reject(new Error("rawMessage was emitted"));
          });
          otherClient.once("message", () => {
            resolve();
          });
        });
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawMessage));
        });
        await otherClient.connect();
        await raw;
        await otherClient.disconnect();
      });
      test("Heartbeat", async () => {
        const rawHeartbeat = [1010];
        const heartbeat = {
          subject: "heartbeat",
          channel_id: 1010,
        };
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawHeartbeat));
        });
        const message = new Promise((resolve, reject) => {
          client.once("message", (data) => {
            try {
              (0, node_assert_1.deepStrictEqual)(data, heartbeat);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });
      test("Subscription acknowledgement", async () => {
        const rawAcknowledge = [1002, 1];
        const acknowledge = {
          subject: "subscribed",
          channel_id: 1002,
        };
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawAcknowledge));
        });
        const message = new Promise((resolve, reject) => {
          client.once("message", (data) => {
            try {
              (0, node_assert_1.deepStrictEqual)(data, acknowledge);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });
      test("Ticker", async () => {
        const rawTicker = [
          1002,
          null,
          [
            150,
            "0.00000098",
            "0.00000099",
            "0.00000098",
            "0.01030927",
            "23.24910068",
            "23685243.40788439",
            0,
            "0.00000100",
            "0.00000096",
          ],
        ];
        const ticker = {
          subject: "ticker",
          channel_id: 1002,
          currencyPairId: 150,
          currencyPair: "BTC_SC",
          last: "0.00000098",
          lowestAsk: "0.00000099",
          highestBid: "0.00000098",
          percentChange: "0.01030927",
          baseVolume: "23.24910068",
          quoteVolume: "23685243.40788439",
          isFrozen: false,
          high24hr: "0.00000100",
          low24hr: "0.00000096",
        };
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawTicker));
        });
        const message = new Promise((resolve, reject) => {
          client.once("message", (data) => {
            try {
              (0, node_assert_1.deepStrictEqual)(data, ticker);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });
      test("Volume", async () => {
        const rawVolume = [
          1003,
          null,
          [
            "2018-11-07 16:26",
            5804,
            {
              BTC: "3418.409",
              ETH: "2645.921",
              USDT: "10832502.689",
              USDC: "1578020.908",
            },
          ],
        ];
        const volume = {
          subject: "volume",
          channel_id: 1003,
          time: "2018-11-07 16:26",
          users: 5804,
          volume: {
            BTC: "3418.409",
            ETH: "2645.921",
            USDT: "10832502.689",
            USDC: "1578020.908",
          },
        };
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawVolume));
        });
        const message = new Promise((resolve, reject) => {
          client.once("message", (data) => {
            try {
              (0, node_assert_1.deepStrictEqual)(data, volume);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });
      test("Account notifications", async () => {
        const rawAccountMessage = [
          1000,
          "",
          [
            [
              "p",
              78612171341,
              203,
              "1000.00000000",
              "1.00000000",
              "1",
              null,
              "1580123594000",
            ],
            [
              "n",
              203,
              123212321,
              "1",
              "999.00000000",
              "1.00000000",
              "2020-01-27 11:33:21",
              "1.00000000",
              null,
            ],
            ["b", 298, "m", "-1.00000000"],
            ["o", 123321123, "0.00000000", "c", null],
            ["m", 23432933, 10000, "-0.06000000", null],
            [
              "t",
              12345,
              "0.03000000",
              "0.50000000",
              "0.00250000",
              0,
              6083059,
              "0.00000375",
              "2018-09-08 05:54:09",
              "12345",
              "0",
              "1580123594000",
            ],
            ["k", 12345, null],
          ],
        ];
        const messages = [
          {
            channel_id: 1000,
            subject: "pending",
            orderNumber: 78612171341,
            currencyPairId: 203,
            currencyPair: "USDT_EOS",
            rate: "1000.00000000",
            amount: "1.00000000",
            type: "buy",
            clientOrderId: null,
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 1000,
            subject: "new",
            currencyPairId: 203,
            currencyPair: "USDT_EOS",
            orderNumber: 123212321,
            type: "buy",
            rate: "999.00000000",
            amount: "1.00000000",
            date: "2020-01-27 11:33:21",
            originalAmount: "1.00000000",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "balance",
            currencyId: 298,
            currency: "EOS",
            wallet: "margin",
            amount: "-1.00000000",
          },
          {
            channel_id: 1000,
            subject: "order",
            orderNumber: 123321123,
            newAmount: "0.00000000",
            orderType: "canceled",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "margin",
            orderNumber: 23432933,
            currency: "10000",
            amount: "-0.06000000",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "trade",
            tradeID: 12345,
            rate: "0.03000000",
            amount: "0.50000000",
            feeMultiplier: "0.00250000",
            fundingType: 0,
            orderNumber: 6083059,
            fee: "0.00000375",
            date: "2018-09-08 05:54:09",
            clientOrderId: "12345",
            total_trade: "0",
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 1000,
            subject: "killed",
            orderNumber: 12345,
            clientOrderId: null,
          },
        ];
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawAccountMessage));
        });
        const message = new Promise((resolve, reject) => {
          let i = 0;
          const verify = () => {
            client.once("message", (data) => {
              try {
                (0, node_assert_1.deepStrictEqual)(data, messages[i]);
                i += 1;
                if (i === messages.length) {
                  resolve();
                } else {
                  verify();
                }
              } catch (error) {
                reject(error);
              }
            });
          };
          verify();
        });
        await client.connect();
        await message;
      });
      test("Price aggregated book", async () => {
        const rawPriceAggregatedBook = [
          148,
          818973992,
          [
            [
              "i",
              {
                currencyPair: "BTC_ETH",
                orderBook: [
                  {
                    "0.03119500": "8.87619723",
                    0.03120486: "2.15539849",
                    "0.03120500": "50.78890000",
                    "3777.70000000": "0.00100000",
                    "4999.00000000": "0.05000000",
                    "5000.00000000": "0.20000000",
                  },
                  {
                    "0.03118500": "50.78940000",
                    0.03117855: "10.55121501",
                    0.03117841: "6.20027213",
                    "0.00000003": "20000.00000000",
                    "0.00000002": "670207.00000000",
                    "0.00000001": "1462262.00000000",
                  },
                ],
              },
              "1580123594000",
            ],
            ["o", 1, "0.01924381", "0.00000000", "1580123594000"],
            [
              "t",
              "48555788",
              0,
              "0.01924381",
              "0.60000000",
              1580123594,
              "1580123594000",
            ],
          ],
        ];
        const messages = [
          {
            channel_id: 148,
            sequence: 818973992,
            subject: "snapshot",
            currencyPair: "BTC_ETH",
            asks: {
              "0.03119500": "8.87619723",
              0.03120486: "2.15539849",
              "0.03120500": "50.78890000",
              "3777.70000000": "0.00100000",
              "4999.00000000": "0.05000000",
              "5000.00000000": "0.20000000",
            },
            bids: {
              "0.03118500": "50.78940000",
              0.03117855: "10.55121501",
              0.03117841: "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000",
            },
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 148,
            sequence: 818973992,
            currencyPair: "BTC_ETH",
            subject: "update",
            type: "bid",
            price: "0.01924381",
            size: "0.00000000",
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 148,
            sequence: 818973992,
            currencyPair: "BTC_ETH",
            subject: "publicTrade",
            tradeID: "48555788",
            type: "sell",
            price: "0.01924381",
            size: "0.60000000",
            timestamp: 1580123594,
            epoch_ms: "1580123594000",
          },
        ];
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawPriceAggregatedBook));
        });
        const message = new Promise((resolve, reject) => {
          let i = 0;
          const verify = () => {
            client.once("message", (data) => {
              try {
                (0, node_assert_1.deepStrictEqual)(data, messages[i]);
                i += 1;
                if (i === messages.length) {
                  resolve();
                } else {
                  verify();
                }
              } catch (error) {
                reject(error);
              }
            });
          };
          verify();
        });
        await client.connect();
        await message;
      });
    });
    suite("error", () => {
      test("emits `error`", async () => {
        const error = new Error("Some error");
        client.once("open", () => {
          client.ws?.emit("error", error);
        });
        const errorPromise = new Promise((resolve) => {
          client.once("error", (err) => {
            (0, node_assert_1.deepStrictEqual)(err, error);
            resolve();
          });
        });
        await client.connect();
        await errorPromise;
      });
      test("with no error", async () => {
        const errorPromise = new Promise((resolve, reject) => {
          client.once("open", () => {
            if (client.ws) {
              client.ws.emit("error");
              setImmediate(resolve);
            } else {
              reject(new Error("`socket` is not initialized"));
            }
          });
          client.once("error", () => {
            reject(new Error("`error` was emitted"));
          });
        });
        await client.connect();
        await errorPromise;
      });
    });
  });
  test("passes authentication details through", async () => {
    const key = "poloniex-api-key";
    const secret = "poloniex-api-secret";
    const authClient = new index_js_1.WebSocketClient({ wsUri, key, secret });
    const nonce = 1;
    authClient.nonce = () => nonce;
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws) => {
        ws.once("message", (data) => {
          try {
            const [channel] = index_js_1.DefaultChannels;
            const form = new URLSearchParams({ nonce: `${nonce}` });
            const { sign } = (0, index_js_1.SignRequest)({
              key,
              secret,
              body: form.toString(),
            });
            (0, node_assert_1.deepStrictEqual)(JSON.parse(data), {
              command: "subscribe",
              channel,
              payload: `nonce=${nonce}`,
              key,
              sign,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });
    await authClient.connect();
    await connection;
    await authClient.disconnect();
  });
});
