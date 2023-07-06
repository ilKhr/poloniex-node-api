"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const index_js_1 = require("../index.js");
const ws_1 = require("ws");
const port = 10010;
const ws_url = new URL(`ws://localhost:${port}/ws/`);
const signTimestamp = "1";
const key = "<POLONIEX_API_KEY>";
const secret = "<POLONIEX_API_SECRET>";
suite("WebSocketClient", () => {
  // eslint-disable-next-line init-declarations
  let client;
  // eslint-disable-next-line init-declarations
  let server;
  setup(() => {
    server = new ws_1.WebSocketServer({ port });
    client = new index_js_1.WebSocketClient({ ws_url });
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
    const symbol = "ZEC_USDT";
    const ws = new index_js_1.WebSocketClient({ symbol });
    (0, node_assert_1.deepStrictEqual)(ws.symbol, symbol);
    (0, node_assert_1.deepStrictEqual)(ws.public_ws, null);
    (0, node_assert_1.deepStrictEqual)(ws.private_ws, null);
  });
  test("constructor (with no arguments)", () => {
    const ws = new index_js_1.WebSocketClient();
    (0, node_assert_1.deepStrictEqual)(ws.symbol, index_js_1.DefaultSymbol);
    (0, node_assert_1.deepStrictEqual)(ws.public_ws, null);
    (0, node_assert_1.deepStrictEqual)(ws.private_ws, null);
  });
  test(".connectPublicWS()", async () => {
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (_s, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await connection;
  });
  test(".connectPublicWS() (when `readyState` is `OPEN`)", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connectPublicWS() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connectPublicWS();
    const error = new Error(
      `Could not connect. State: ${ws_1.WebSocket.CONNECTING}`
    );
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.CONNECTING
    );
    await (0, node_assert_1.rejects)(() => client.connectPublicWS(), error);
    await connect;
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connectPublicWS() (when `readyState` is `CLOSING`)", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    const disconnect = client.disconnectPublicWS();
    const error = new Error(
      `Could not connect. State: ${ws_1.WebSocket.CLOSING}`
    );
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSING
    );
    await (0, node_assert_1.rejects)(client.connectPublicWS(), error);
    await disconnect;
  });
  test(".connectPublicWS() (when `readyState` is `CLOSED`)", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".disconnectPublicWS()", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".disconnectPublicWS() (when socket is not initialized)", async () => {
    (0, node_assert_1.deepStrictEqual)(client.public_ws, null);
    await client.disconnectPublicWS();
    (0, node_assert_1.deepStrictEqual)(client.public_ws, null);
  });
  test(".disconnectPublicWS() (when `readyState` is `CLOSED`)", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
    await client.disconnectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".disconnectPublicWS() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connectPublicWS();
    const error = new Error(
      `Could not disconnect. State: ${ws_1.WebSocket.CONNECTING}`
    );
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.CONNECTING
    );
    await (0, node_assert_1.rejects)(client.disconnectPublicWS(), error);
    await connect;
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".disconnectPublicWS() (when `readyState` is `CLOSING`)", async () => {
    await client.connectPublicWS();
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    const disconnect = client.disconnectPublicWS();
    const error = new Error(
      `Could not disconnect. State: ${ws_1.WebSocket.CLOSING}`
    );
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSING
    );
    await (0, node_assert_1.rejects)(client.disconnectPublicWS(), error);
    await disconnect;
    (0, node_assert_1.deepStrictEqual)(
      client.public_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
  });
  test(".connectPrivateWS()", async () => {
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (_s, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await connection;
  });
  test(".connectPrivateWS() (when `readyState` is `OPEN`)", async () => {
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connectPrivateWS() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connectPrivateWS();
    const error = new Error("Could not connect. State: 0");
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws?.readyState,
      ws_1.WebSocket.CONNECTING
    );
    await (0, node_assert_1.rejects)(client.connectPrivateWS(), error);
    await connect;
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".connectPrivateWS() (when `readyState` is `CLOSING`)", async () => {
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    const disconnect = client.disconnectPrivateWS();
    const error = new Error("Could not connect. State: 2");
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws.readyState,
      ws_1.WebSocket.CLOSING
    );
    await (0, node_assert_1.rejects)(client.connectPrivateWS(), error);
    await disconnect;
  });
  test(".connectPrivateWS() (when `readyState` is `CLOSED`)", async () => {
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws?.readyState,
      ws_1.WebSocket.OPEN
    );
    await client.disconnectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws.readyState,
      ws_1.WebSocket.CLOSED
    );
    await client.connectPrivateWS();
    (0, node_assert_1.deepStrictEqual)(
      client.private_ws.readyState,
      ws_1.WebSocket.OPEN
    );
  });
  test(".pingPublic()", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.pingPublic({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".pingPublic() (with no `signal`)", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.pingPublic();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".pingPublic() (with aborted `signal`)", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.pingPublic({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".pingPrivate()", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.pingPrivate({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".pingPrivate() (with no `signal`)", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.pingPrivate();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".pingPrivate() (with aborted `signal`)", async () => {
    const req = { event: "ping" };
    const res = { event: "pong" };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.pingPrivate({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".unsubscribePublic()", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.unsubscribePublic({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".unsubscribePublic() (with no `signal`)", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.unsubscribePublic();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".unsubscribePublic() (with aborted `signal`)", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.unsubscribePublic({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".unsubscribePrivate()", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.unsubscribePrivate({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".unsubscribePrivate() (with no `signal`)", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.unsubscribePrivate();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".unsubscribePrivate() (with aborted `signal`)", async () => {
    const req = { event: "unsubscribe_all" };
    const res = { channel: "all", event: "unsubscribe_all" };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.unsubscribePrivate({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".getPublicSubscriptions()", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["ticker"] };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.getPublicSubscriptions({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".getPublicSubscriptions() (with no `signal`)", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["ticker"] };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.getPublicSubscriptions();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".getPublicSubscriptions() (with aborted `signal`)", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["ticker"] };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const result = await client.getPublicSubscriptions({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".getPrivateSubscriptions()", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["balances"] };
    const abort_error = new index_js_1.WSAbort("The request has been aborted");
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const ac = new AbortController();
    setImmediate(() => {
      ac.abort();
    });
    await (0, node_assert_1.rejects)(
      () => client.getPrivateSubscriptions({ signal: ac.signal }),
      abort_error
    );
    await connection;
  });
  test(".getPrivateSubscriptions() (with no `signal`)", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["balances"] };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.getPrivateSubscriptions();
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".getPrivateSubscriptions() (with aborted `signal`)", async () => {
    const req = { event: "list_subscriptions" };
    const res = { subscriptions: ["balances"] };
    const ac = new AbortController();
    ac.abort();
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const result = await client.getPrivateSubscriptions({ signal: ac.signal });
    (0, node_assert_1.deepStrictEqual)(result, res);
    await connection;
  });
  test(".subscribeCandles()", async () => {
    const channel = "candles_hour_2";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeCandles({ channel, signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeCandles() (with no `symbols`)", async () => {
    const channel = "candles_hour_2";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.subscribeCandles({ channel });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeCandles()", async () => {
    const channel = "candles_hour_2";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeCandles({
      channel,
      signal,
      symbols,
    });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeCandles() (with no `symbols`)", async () => {
    const channel = "candles_hour_2";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.unsubscribeCandles({ channel });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeCandles() (not subscribed errors)", async () => {
    const channel = "candles_hour_2";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeCandles({ channel }),
      new Error(res.message)
    );
    await connection;
  });
  test(".candles()", async () => {
    const channel = "candles_minute_1";
    const symbols = ["BTC_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const candle = {
      channel,
      data: [
        {
          symbol: "BTC_USDT",
          amount: "0",
          high: "9999.07",
          quantity: "0",
          tradeCount: 0,
          low: "9999.07",
          closeTime: 1648057199999,
          startTime: 1648057140000,
          close: "9999.07",
          open: "9999.07",
          ts: 1648057141081,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(candle), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const candles = client.candles({ channel, symbols, signal });
    const next = await candles.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, candle);
    await connection;
  });
  test(".candles() (with no `symbols`)", async () => {
    const channel = "candles_minute_1";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const candle = {
      channel,
      data: [
        {
          symbol: "BTC_USDT",
          amount: "0",
          high: "9999.07",
          quantity: "0",
          tradeCount: 0,
          low: "9999.07",
          closeTime: 1648057199999,
          startTime: 1648057140000,
          close: "9999.07",
          open: "9999.07",
          ts: 1648057141081,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(candle), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        client.public_ws?.once("message", () => {
                          ws.send(JSON.stringify(candle), (err2) => {
                            if (err2) {
                              reject(err2);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const candles = client.candles({ channel });
    const candle1 = await candles.next();
    (0, node_assert_1.deepStrictEqual)(candle1.done, false);
    (0, node_assert_1.deepStrictEqual)(candle1.value, candle);
    const candle2 = await candles.next();
    (0, node_assert_1.deepStrictEqual)(candle2.done, false);
    (0, node_assert_1.deepStrictEqual)(candle2.value, candle);
    await connection;
  });
  test(".subscribeTrades()", async () => {
    const channel = "trades";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeTrades({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeTrades() (with no `symbols`)", async () => {
    const channel = "trades";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.subscribeTrades();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTrades()", async () => {
    const channel = "trades";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeTrades({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTrades() (with no `symbols`)", async () => {
    const channel = "trades";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.unsubscribeTrades();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTrades() (not subscribed errors)", async () => {
    const channel = "trades";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeTrades(),
      new Error(res.message)
    );
    await connection;
  });
  test(".trades()", async () => {
    const channel = "trades";
    const symbols = ["BTC_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const trade = {
      channel: "trades",
      data: [
        {
          symbol: "BTC_USDT",
          amount: "70",
          takerSide: "buy",
          quantity: "4",
          createTime: 1648059516810,
          price: "104",
          id: 1648059516810,
          ts: 1648059516832,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(trade), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const trades = client.trades({ symbols, signal });
    const next = await trades.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, trade);
    await connection;
  });
  test(".trades() (with no `symbols`)", async () => {
    const channel = "trades";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const trade = {
      channel: "trades",
      data: [
        {
          symbol: "BTC_USDT",
          amount: "70",
          takerSide: "buy",
          quantity: "4",
          createTime: 1648059516810,
          price: "104",
          id: 1648059516810,
          ts: 1648059516832,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(trade), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        client.public_ws?.once("message", () => {
                          ws.send(JSON.stringify(trade), (err2) => {
                            if (err2) {
                              reject(err2);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const trades = client.trades();
    const trade1 = await trades.next();
    (0, node_assert_1.deepStrictEqual)(trade1.done, false);
    (0, node_assert_1.deepStrictEqual)(trade1.value, trade);
    const trade2 = await trades.next();
    (0, node_assert_1.deepStrictEqual)(trade2.done, false);
    (0, node_assert_1.deepStrictEqual)(trade2.value, trade);
    await connection;
  });
  test(".subscribeTicker()", async () => {
    const channel = "ticker";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeTicker({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeTicker() (with no `symbols`)", async () => {
    const channel = "ticker";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.subscribeTicker();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTicker()", async () => {
    const channel = "ticker";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeTicker({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTicker() (with no `symbols`)", async () => {
    const channel = "ticker";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.unsubscribeTicker();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeTicker() (not subscribed errors)", async () => {
    const channel = "ticker";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeTicker(),
      new Error(res.message)
    );
    await connection;
  });
  test(".tickers()", async () => {
    const channel = "ticker";
    const symbols = ["ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const ticker = {
      channel,
      data: [
        {
          symbol: "ETH_USDT",
          dailyChange: "0.9428",
          high: "507",
          amount: "20",
          quantity: "3",
          tradeCount: 11,
          low: "16",
          closeTime: 1634062351868,
          startTime: 1633996800000,
          close: "204",
          open: "105",
          ts: 1648052794867,
          markPrice: "205",
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(ticker), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const tickers = client.tickers({ symbols, signal });
    const next = await tickers.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, ticker);
    await connection;
  });
  test(".tickers() (with no `symbols`)", async () => {
    const channel = "ticker";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const ticker = {
      channel: "ticker",
      data: [
        {
          symbol: "ETH_USDT",
          dailyChange: "0.9428",
          high: "507",
          amount: "20",
          quantity: "3",
          tradeCount: 11,
          low: "16",
          closeTime: 1634062351868,
          startTime: 1633996800000,
          close: "204",
          open: "105",
          ts: 1648052794867,
          markPrice: "205",
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(ticker), (error2) => {
                      if (error2) {
                        reject(error2);
                      } else {
                        client.public_ws?.once("message", () => {
                          ws.send(JSON.stringify(ticker), (error3) => {
                            if (error3) {
                              reject(error3);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const tickers = client.tickers();
    const ticker1 = await tickers.next();
    (0, node_assert_1.deepStrictEqual)(ticker1.done, false);
    (0, node_assert_1.deepStrictEqual)(ticker1.value, ticker);
    const ticker2 = await tickers.next();
    (0, node_assert_1.deepStrictEqual)(ticker2.done, false);
    (0, node_assert_1.deepStrictEqual)(ticker2.value, ticker);
    await connection;
  });
  test(".subscribeBook()", async () => {
    const channel = "book";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const depth = 20;
    const req = { channel: [channel], symbols, event, depth };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeBook({ signal, symbols, depth });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeBook() (with no `symbols`)", async () => {
    const channel = "book";
    const symbols = [client.symbol];
    const event = "subscribe";
    const depth = 5;
    const req = { channel: [channel], symbols, event, depth };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.subscribeBook();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBook()", async () => {
    const channel = "book";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeBook({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBook() (with no `symbols`)", async () => {
    const channel = "book";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.unsubscribeBook();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBook() (not subscribed errors)", async () => {
    const channel = "book";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeBook(),
      new Error(res.message)
    );
    await connection;
  });
  test(".books()", async () => {
    const channel = "book";
    const symbols = ["ETH_USDT"];
    const event = "subscribe";
    const depth = 20;
    const req = { channel: [channel], symbols, event, depth };
    const res = { channel, event, symbols };
    const book = {
      channel: "book",
      data: [
        {
          symbol: "BTC_USDT",
          createTime: 1675161592831,
          asks: [],
          bids: [
            ["40001", "2.87"],
            ["39999", "1"],
          ],
          id: 140431704,
          ts: 1675161595701,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(book), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const books = client.books({ symbols, signal, depth });
    const next = await books.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, book);
    await connection;
  });
  test(".books() (with no `symbols`)", async () => {
    const channel = "book";
    const symbols = [client.symbol];
    const event = "subscribe";
    const depth = 5;
    const req = { channel: [channel], symbols, event, depth };
    const res = { channel, event, symbols };
    const book = {
      channel: "book",
      data: [
        {
          symbol: "BTC_USDT",
          createTime: 1675161592831,
          asks: [],
          bids: [
            ["40001", "2.87"],
            ["39999", "1"],
          ],
          id: 140431704,
          ts: 1675161595701,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(book), (error2) => {
                      if (error2) {
                        reject(error2);
                      } else {
                        client.public_ws?.once("message", () => {
                          ws.send(JSON.stringify(book), (error3) => {
                            if (error3) {
                              reject(error3);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const books = client.books();
    const book1 = await books.next();
    (0, node_assert_1.deepStrictEqual)(book1.done, false);
    (0, node_assert_1.deepStrictEqual)(book1.value, book);
    const book2 = await books.next();
    (0, node_assert_1.deepStrictEqual)(book2.done, false);
    (0, node_assert_1.deepStrictEqual)(book2.value, book);
    await connection;
  });
  test(".subscribeLv2Book()", async () => {
    const channel = "book_lv2";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeLv2Book({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeLv2Book() (with no `symbols`)", async () => {
    const channel = "book_lv2";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.subscribeLv2Book();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeLv2Book()", async () => {
    const channel = "book_lv2";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeLv2Book({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeLv2Book() (with no `symbols`)", async () => {
    const channel = "book_lv2";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const actual = await client.unsubscribeLv2Book();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeLv2Book() (not subscribed errors)", async () => {
    const channel = "book_lv2";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeLv2Book(),
      new Error(res.message)
    );
    await connection;
  });
  test(".booksLv2()", async () => {
    const channel = "book_lv2";
    const symbols = ["ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const book = {
      channel: "book_lv2",
      data: [
        {
          symbol: "BTC_USDT",
          createTime: 1675162438257,
          asks: [
            ["6.16", "0.6"],
            ["6.17", "1"],
            ["6.18", "1"],
          ],
          bids: [
            ["5.65", "0.02"],
            ["5.61", "1.68"],
            ["5.6", "25.38"],
          ],
          lastId: 140436915,
          id: 140436916,
          ts: 1675162438286,
        },
      ],
      action: "snapshot",
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(book), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const { signal } = new AbortController();
    const books = client.booksLv2({ symbols, signal });
    const next = await books.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, book);
    await connection;
  });
  test(".booksLv2() (with no `symbols`)", async () => {
    const channel = "book_lv2";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const snapshot = {
      channel: "book_lv2",
      data: [
        {
          symbol: "BTC_USDT",
          createTime: 1675162438257,
          asks: [
            ["6.16", "0.6"],
            ["6.17", "1"],
            ["6.18", "1"],
          ],
          bids: [
            ["5.65", "0.02"],
            ["5.61", "1.68"],
            ["5.6", "25.38"],
          ],
          lastId: 140436915,
          id: 140436916,
          ts: 1675162438286,
        },
      ],
      action: "snapshot",
    };
    const update = {
      channel: "book_lv2",
      data: [
        {
          symbol: "BTC_USDT",
          createTime: 1675162438876,
          asks: [["6.16", "0"]],
          bids: [],
          lastId: 140436927,
          id: 140436928,
          ts: 1675162438882,
        },
      ],
      action: "update",
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.public_ws?.once("message", () => {
                    ws.send(JSON.stringify(snapshot), (error2) => {
                      if (error2) {
                        reject(error2);
                      } else {
                        client.public_ws?.once("message", () => {
                          ws.send(JSON.stringify(update), (error3) => {
                            if (error3) {
                              reject(error3);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    const books = client.booksLv2();
    const book1 = await books.next();
    (0, node_assert_1.deepStrictEqual)(book1.done, false);
    (0, node_assert_1.deepStrictEqual)(book1.value, snapshot);
    const book2 = await books.next();
    (0, node_assert_1.deepStrictEqual)(book2.done, false);
    (0, node_assert_1.deepStrictEqual)(book2.value, update);
    await connection;
  });
  test(".auth()", async () => {
    const auth_client = new index_js_1.WebSocketClient({
      key,
      secret,
      signTimestamp: () => signTimestamp,
      ws_url,
    });
    const channel = "auth";
    const event = "subscribe";
    const params = {
      key,
      signatureMethod: index_js_1.signatureMethod,
      signatureVersion: `${index_js_1.signatureVersion}`,
      signTimestamp,
      signature: "H3U+62hjPu3cbAsuFz4gYa/r2HBU92kW4j4M4RZQ9Jo=",
    };
    const req = { channel: [channel], event, params };
    const res = {
      data: { success: true, ts: 1645597033915 },
      channel: "auth",
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await auth_client.connectPrivateWS();
    const { signal } = new AbortController();
    const actual = await auth_client.auth({ signal });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".auth() (invalid credentials)", async () => {
    const auth_client = new index_js_1.WebSocketClient({
      key,
      secret,
      signTimestamp: () => signTimestamp,
      ws_url,
    });
    const channel = "auth";
    const event = "subscribe";
    const params = {
      key,
      signatureMethod: index_js_1.signatureMethod,
      signatureVersion: `${index_js_1.signatureVersion}`,
      signTimestamp,
      signature: "H3U+62hjPu3cbAsuFz4gYa/r2HBU92kW4j4M4RZQ9Jo=",
    };
    const req = { channel: [channel], event, params };
    const res = {
      data: {
        success: false,
        message: "Authentication failed!",
        ts: 1646276295075,
      },
      channel: "auth",
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await auth_client.connectPrivateWS();
    await (0, node_assert_1.rejects)(
      auth_client.auth(),
      new Error(res.data.message)
    );
    await connection;
  });
  test(".auth() (missing credentials)", async () => {
    const auth_client = new index_js_1.WebSocketClient({ key, ws_url });
    await (0, node_assert_1.rejects)(
      auth_client.auth(),
      new Error("Auth credintials are missing")
    );
  });
  test(".subscribeOrders()", async () => {
    const channel = "orders";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeOrders({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeOrders() (with no `symbols`)", async () => {
    const channel = "orders";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const actual = await client.subscribeOrders();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeOrders()", async () => {
    const channel = "orders";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeOrders({ signal, symbols });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeOrders() (with no `symbols`)", async () => {
    const channel = "orders";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const actual = await client.unsubscribeOrders();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeOrders() (not subscribed errors)", async () => {
    const channel = "orders";
    const { symbol } = client;
    const symbols = [symbol];
    const event = "unsubscribe";
    const req = { channel: [channel], symbols, event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeOrders(),
      new Error(res.message)
    );
    await connection;
  });
  test(".orders()", async () => {
    const channel = "orders";
    const symbols = ["ETH_USDT"];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const order = {
      channel: "orders",
      data: [
        {
          symbol: "BTC_USDT",
          type: "LIMIT",
          quantity: "1",
          orderId: "32471407854219264",
          tradeFee: "0",
          clientOrderId: "",
          accountType: "SPOT",
          feeCurrency: "",
          eventType: "place",
          source: "API",
          side: "BUY",
          filledQuantity: "0",
          filledAmount: "0",
          matchRole: "MAKER",
          state: "NEW",
          tradeTime: 0,
          tradeAmount: "0",
          orderAmount: "0",
          createTime: 1648708186922,
          price: "47112.1",
          tradeQty: "0",
          tradePrice: "0",
          tradeId: "0",
          ts: 1648708187469,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.private_ws?.once("message", () => {
                    ws.send(JSON.stringify(order), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const orders = client.orders({ symbols, signal });
    const next = await orders.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, order);
    await connection;
  });
  test(".orders() (with no `symbols`)", async () => {
    const channel = "orders";
    const symbols = [client.symbol];
    const event = "subscribe";
    const req = { channel: [channel], symbols, event };
    const res = { channel, event, symbols };
    const order = {
      channel: "orders",
      data: [
        {
          symbol: "BTC_USDT",
          type: "LIMIT",
          quantity: "1",
          orderId: "32471407854219264",
          tradeFee: "0",
          clientOrderId: "",
          accountType: "SPOT",
          feeCurrency: "",
          eventType: "place",
          source: "API",
          side: "BUY",
          filledQuantity: "0",
          filledAmount: "0",
          matchRole: "MAKER",
          state: "NEW",
          tradeTime: 0,
          tradeAmount: "0",
          orderAmount: "0",
          createTime: 1648708186922,
          price: "47112.1",
          tradeQty: "0",
          tradePrice: "0",
          tradeId: "0",
          ts: 1648708187469,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.private_ws?.once("message", () => {
                    ws.send(JSON.stringify(order), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        client.private_ws?.once("message", () => {
                          ws.send(JSON.stringify(order), (err2) => {
                            if (err2) {
                              reject(err2);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const orders = client.orders();
    const order1 = await orders.next();
    (0, node_assert_1.deepStrictEqual)(order1.done, false);
    (0, node_assert_1.deepStrictEqual)(order1.value, order);
    const order2 = await orders.next();
    (0, node_assert_1.deepStrictEqual)(order2.done, false);
    (0, node_assert_1.deepStrictEqual)(order2.value, order);
    await connection;
  });
  test(".subscribeBalances()", async () => {
    const channel = "balances";
    const event = "subscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const actual = await client.subscribeBalances({ signal });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".subscribeBalances() (with no options)", async () => {
    const channel = "balances";
    const event = "subscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const actual = await client.subscribeBalances();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBalances()", async () => {
    const channel = "balances";
    const event = "unsubscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const actual = await client.unsubscribeBalances({ signal });
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBalances() (with no options)", async () => {
    const channel = "balances";
    const event = "unsubscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const actual = await client.unsubscribeBalances();
    (0, node_assert_1.deepStrictEqual)(actual, res);
    await connection;
  });
  test(".unsubscribeBalances() (not subscribed errors)", async () => {
    const channel = "balances";
    const event = "unsubscribe";
    const req = { channel: [channel], event };
    const res = { message: "Error Message", event: "error" };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    await (0, node_assert_1.rejects)(
      client.unsubscribeBalances(),
      new Error(res.message)
    );
    await connection;
  });
  test(".balances()", async () => {
    const channel = "balances";
    const event = "subscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const balance = {
      channel: "balances",
      data: [
        {
          changeTime: 1657312008411,
          accountId: "1234",
          accountType: "SPOT",
          eventType: "place_order",
          available: "9999999983.668",
          currency: "BTC",
          id: 60018450912695040,
          userId: 12345,
          hold: "16.332",
          ts: 1657312008443,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.private_ws?.once("message", () => {
                    ws.send(JSON.stringify(balance), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const { signal } = new AbortController();
    const balances = client.balances({ signal });
    const next = await balances.next();
    (0, node_assert_1.deepStrictEqual)(next.done, false);
    (0, node_assert_1.deepStrictEqual)(next.value, balance);
    await connection;
  });
  test(".balances() (with no options)", async () => {
    const channel = "balances";
    const event = "subscribe";
    const req = { channel: [channel], event };
    const res = { channel, event };
    const balance = {
      channel: "balances",
      data: [
        {
          changeTime: 1657312008411,
          accountId: "1234",
          accountType: "SPOT",
          eventType: "place_order",
          available: "9999999983.668",
          currency: "BTC",
          id: 60018450912695040,
          userId: 12345,
          hold: "16.332",
          ts: 1657312008443,
        },
      ],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), req);
              ws.send(JSON.stringify(res), (error) => {
                if (error) {
                  reject(error);
                } else {
                  client.private_ws?.once("message", () => {
                    ws.send(JSON.stringify(balance), (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        client.private_ws?.once("message", () => {
                          ws.send(JSON.stringify(balance), (err2) => {
                            if (err2) {
                              reject(err2);
                            } else {
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    const balances = client.balances();
    const balance1 = await balances.next();
    (0, node_assert_1.deepStrictEqual)(balance1.done, false);
    (0, node_assert_1.deepStrictEqual)(balance1.value, balance);
    const balance2 = await balances.next();
    (0, node_assert_1.deepStrictEqual)(balance2.done, false);
    (0, node_assert_1.deepStrictEqual)(balance2.value, balance);
    await connection;
  });
  test(".send() (public)", async () => {
    const payload = {
      event: "subscribe",
      channel: ["candles_minute_1", "ticker"],
      symbols: ["BTC_USDT", "ETH_USDT"],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}public`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), payload);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPublicWS();
    await client.send(payload, "public");
    await connection;
  });
  test(".send() (private)", async () => {
    const payload = {
      event: "subscribe",
      channel: ["orders", "balances"],
      symbols: ["all"],
    };
    const connection = new Promise((resolve, reject) => {
      server.once("connection", (ws, request) => {
        try {
          (0, node_assert_1.deepStrictEqual)(
            `${ws_url.pathname}private`,
            request.url
          );
          ws.once("message", (message) => {
            try {
              (0, node_assert_1.deepStrictEqual)(JSON.parse(message), payload);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    await client.connectPrivateWS();
    await client.send(payload, "private");
    await connection;
  });
  test(".send() (when WebSocket is not connected)", async () => {
    await (0, node_assert_1.rejects)(
      client.send({}, "private"),
      new Error("Websocket is not connected")
    );
  });
  test(".send() (with an `error`)", async () => {
    const payload = {
      event: "subscribe",
      channel: ["orders", "balances"],
      symbols: ["all"],
    };
    await client.connectPrivateWS();
    client.private_ws?.close();
    await (0, node_assert_1.rejects)(
      client.send(payload, "private"),
      new Error(
        `WebSocket is not open: readyState ${ws_1.WebSocket.CLOSING} (CLOSING)`
      )
    );
  });
  suite("private methods", () => {
    test(".#send() (when WebSocket is not connected)", async () => {
      const auth_client = new index_js_1.WebSocketClient({
        ws_url,
        key,
        secret,
      });
      await (0, node_assert_1.rejects)(
        auth_client.auth(),
        new Error("Websocket is not connected")
      );
    });
    test(".#send() (when WebSocket is closed)", async () => {
      await client.connectPublicWS();
      const promise = client.pingPublic();
      client.public_ws?.close();
      await (0, node_assert_1.rejects)(
        promise,
        new Error("WebSocket connection has been closed")
      );
    });
    test(".#disconnectWS() (when an `error` is emitted)", async () => {
      await client.connectPublicWS();
      (0, node_assert_1.deepStrictEqual)(
        client.public_ws?.readyState,
        ws_1.WebSocket.OPEN
      );
      const error = new Error("MSG");
      const error_promise = new Promise((resolve, reject) => {
        client.once("error", (err, type) => {
          try {
            (0, node_assert_1.deepStrictEqual)(type, "public");
            (0, node_assert_1.deepStrictEqual)(err, error);
            resolve();
          } catch (err2) {
            reject(err2);
          }
        });
      });
      const promise = client.disconnectPublicWS();
      (0, node_assert_1.deepStrictEqual)(
        client.public_ws.readyState,
        ws_1.WebSocket.CLOSING
      );
      client.public_ws.emit("error", error);
      await (0, node_assert_1.rejects)(promise, error);
      await error_promise;
    });
    test(".#connectWS() (when message is not parsable)", async () => {
      const promise = new Promise((resolve, reject) => {
        client.once("error", (error, type) => {
          try {
            (0, node_assert_1.deepStrictEqual)(type, "public");
            (0, node_assert_1.deepStrictEqual)(
              error,
              new Error("Message count not be parsed by `JSON.parse`")
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
      server.once("connection", (ws) => {
        ws.send("Not JSON");
      });
      await client.connectPublicWS();
      await promise;
    });
    test(".#send() (with an `error`)", async () => {
      await client.connectPublicWS();
      (0, node_assert_1.deepStrictEqual)(
        client.public_ws?.readyState,
        ws_1.WebSocket.OPEN
      );
      client.public_ws.close();
      (0, node_assert_1.deepStrictEqual)(
        client.public_ws.readyState,
        ws_1.WebSocket.CLOSING
      );
      const { signal } = new AbortController();
      await (0, node_assert_1.rejects)(client.pingPublic({ signal }));
    });
  });
});
