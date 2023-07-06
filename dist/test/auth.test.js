"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const node_util_1 = require("node:util");
const undici_1 = require("undici");
const index_js_1 = require("../index.js");
suite("AuthenticatedClient", () => {
  const api_url = new URL(index_js_1.ApiUrl);
  const key = "poloniex-api-key";
  const secret = "poloniex-api-secret";
  const signTimestamp = Date.now().toString();
  const client = new index_js_1.AuthenticatedClient({
    key,
    secret,
    signTimestamp: () => signTimestamp,
  });
  function headers(h) {
    return (
      h.key === key &&
      h.signtimestamp === signTimestamp &&
      typeof h.signature === "string"
    );
  }
  function body(options) {
    return (string) => {
      if (Object.keys(options).length === 0) {
        return string === null;
      } else if (string === null) {
        return false;
      }
      return (0, node_util_1.isDeepStrictEqual)(JSON.parse(string), options);
    };
  }
  const globalDispatcher = (0, undici_1.getGlobalDispatcher)();
  const mockAgent = new undici_1.MockAgent();
  const mockPool = mockAgent.get(api_url.origin);
  suiteSetup(() => {
    (0, undici_1.setGlobalDispatcher)(mockAgent);
    mockAgent.disableNetConnect();
  });
  suiteTeardown(() => {
    mockAgent.enableNetConnect();
    (0, undici_1.setGlobalDispatcher)(globalDispatcher);
  });
  test("constructor", () => {
    const symbol = "ETH_BTC";
    const url = "https://sandbox-api.poloniex.com/";
    const other_client = new index_js_1.AuthenticatedClient({
      key,
      secret,
      symbol,
      url,
    });
    (0, node_assert_1.deepStrictEqual)(other_client.symbol, symbol);
    (0, node_assert_1.deepStrictEqual)(other_client.base_url, new URL(url));
  });
  test("constructor (default settings)", () => {
    (0, node_assert_1.deepStrictEqual)(client.symbol, index_js_1.DefaultSymbol);
    (0, node_assert_1.deepStrictEqual)(
      client.base_url,
      new URL(index_js_1.ApiUrl)
    );
    (0, node_assert_1.deepStrictEqual)(client.reject, true);
    (0, node_assert_1.deepStrictEqual)(client.transform, "json");
  });
  test(".fetch() (when options is an array)", async () => {
    const other_client = new index_js_1.AuthenticatedClient({ key, secret });
    await (0, node_assert_1.rejects)(
      () => other_client.fetch("/", { options: [] }),
      new TypeError("`options` shoud not be an array")
    );
  });
  test(".fetch() (with provided headers)", async () => {
    const new_headers = {
      signatureVersion: `${index_js_1.signatureVersion + 1}`,
    };
    const uri = `/path`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = {
      path,
      method,
      headers: { signatureVersion: index_js_1.signatureVersion.toString() },
      query,
    };
    mockPool.intercept(intercept_options).reply(200, {});
    await client.fetch(uri, { headers: new_headers });
  });
  test(".getAccounts()", async () => {
    const accounts = [
      { accountId: "123", accountType: "SPOT", accountState: "NORMAL" },
    ];
    const uri = `/accounts`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, accounts);
    const data = await client.getAccounts();
    (0, node_assert_1.deepStrictEqual)(data, accounts);
  });
  test(".getAccountBalances()", async () => {
    const balances = [
      {
        accountId: "123",
        accountType: "SPOT",
        balances: [
          {
            currencyId: "60001",
            currency: "TRX",
            available: "93640.421767943475",
            hold: "19.84382885",
          },
          {
            currencyId: "60002",
            currency: "ELON",
            available: "100037.9449",
            hold: "0.00",
          },
          {
            currencyId: "60003",
            currency: "USDC",
            available: "78086.768609427831705",
            hold: "22577.045",
          },
        ],
      },
    ];
    const uri = "/accounts/balances";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, balances);
    const data = await client.getAccountBalances();
    (0, node_assert_1.deepStrictEqual)(data, balances);
  });
  test(".getAccountBalances() (with `accountType`)", async () => {
    const balances = [
      {
        accountId: "123",
        accountType: "SPOT",
        balances: [
          {
            currencyId: "60001",
            currency: "TRX",
            available: "93640.421767943475",
            hold: "19.84382885",
          },
          {
            currencyId: "60002",
            currency: "ELON",
            available: "100037.9449",
            hold: "0.00",
          },
          {
            currencyId: "60003",
            currency: "USDC",
            available: "78086.768609427831705",
            hold: "22577.045",
          },
        ],
      },
    ];
    const accountType = "SPOT";
    const options = { accountType };
    const uri = "/accounts/balances";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, balances);
    const data = await client.getAccountBalances(options);
    (0, node_assert_1.deepStrictEqual)(data, balances);
  });
  test(".getAccountBalances() (with `id`)", async () => {
    const balances = [
      {
        accountId: "123",
        accountType: "SPOT",
        balances: [
          {
            currencyId: "60001",
            currency: "TRX",
            available: "93640.421767943475",
            hold: "19.84382885",
          },
          {
            currencyId: "60002",
            currency: "ELON",
            available: "100037.9449",
            hold: "0.00",
          },
          {
            currencyId: "60003",
            currency: "USDC",
            available: "78086.768609427831705",
            hold: "22577.045",
          },
        ],
      },
    ];
    const id = "123";
    const options = { id };
    const uri = `/accounts/${id}/balances`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, balances);
    const data = await client.getAccountBalances(options);
    (0, node_assert_1.deepStrictEqual)(data, balances);
  });
  test(".getAccountActivity()", async () => {
    const activity = [
      {
        id: "22774050",
        currency: "LINK",
        amount: "100000000",
        state: "SUCCESS",
        createTime: 1659781580499,
        description: "Your airdrop for 100000000 LINK",
        activityType: 200,
      },
      {
        id: "22774049",
        currency: "ADA",
        amount: "100000000",
        state: "SUCCESS",
        createTime: 1659781579899,
        description: "Your airdrop for 100000000 ADA",
        activityType: 200,
      },
    ];
    const activityType = index_js_1.AccountActivities.ALL;
    const options = { activityType };
    const uri = "/accounts/activity";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, activity);
    const data = await client.getAccountActivity(options);
    (0, node_assert_1.deepStrictEqual)(data, activity);
  });
  test(".getAccountActivity() (with no options)", async () => {
    const activity = [
      {
        id: "22774050",
        currency: "LINK",
        amount: "100000000",
        state: "SUCCESS",
        createTime: 1659781580499,
        description: "Your airdrop for 100000000 LINK",
        activityType: 200,
      },
      {
        id: "22774049",
        currency: "ADA",
        amount: "100000000",
        state: "SUCCESS",
        createTime: 1659781579899,
        description: "Your airdrop for 100000000 ADA",
        activityType: 200,
      },
    ];
    const uri = "/accounts/activity";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, activity);
    const data = await client.getAccountActivity();
    (0, node_assert_1.deepStrictEqual)(data, activity);
  });
  test(".transfer()", async () => {
    const transferId = { transferId: "2977" };
    const currency = "USDT";
    const amount = "10.5";
    const fromAccount = "SPOT";
    const toAccount = "FUTURES";
    const options = { currency, amount, fromAccount, toAccount };
    const uri = "/accounts/transfer";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, transferId);
    const data = await client.transfer(options);
    (0, node_assert_1.deepStrictEqual)(data, transferId);
  });
  test(".getAccountTransfers()", async () => {
    const transfers = [
      {
        id: "23365",
        fromAccount: "SPOT",
        toAccount: "FUTURES",
        currency: "USDT",
        amount: "0.01",
        state: "SUCCESS",
        createTime: 1656000618690,
      },
      {
        id: "532",
        fromAccount: "SPOT",
        toAccount: "FUTURES",
        currency: "USDT",
        amount: "1.2",
        state: "SUCCESS",
        createTime: 1650843791635,
      },
      {
        id: "147",
        fromAccount: "FUTURES",
        toAccount: "SPOT",
        currency: "ETH",
        amount: "2.05",
        state: "SUCCESS",
        createTime: 1650465162165,
      },
    ];
    const endTime = Date.now();
    const startTime = Date.now() - 1000 * 60 * 60 * 24;
    const options = { startTime, endTime };
    const uri = "/accounts/transfer";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, transfers);
    const data = await client.getAccountTransfers(options);
    (0, node_assert_1.deepStrictEqual)(data, transfers);
  });
  test(".getAccountTransfers() (with no `options`)", async () => {
    const transfers = [
      {
        id: "23365",
        fromAccount: "SPOT",
        toAccount: "FUTURES",
        currency: "USDT",
        amount: "0.01",
        state: "SUCCESS",
        createTime: 1656000618690,
      },
      {
        id: "532",
        fromAccount: "SPOT",
        toAccount: "FUTURES",
        currency: "USDT",
        amount: "1.2",
        state: "SUCCESS",
        createTime: 1650843791635,
      },
      {
        id: "147",
        fromAccount: "FUTURES",
        toAccount: "SPOT",
        currency: "ETH",
        amount: "2.05",
        state: "SUCCESS",
        createTime: 1650465162165,
      },
    ];
    const uri = "/accounts/transfer";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, transfers);
    const data = await client.getAccountTransfers();
    (0, node_assert_1.deepStrictEqual)(data, transfers);
  });
  test(".getFeeInfo()", async () => {
    const fees = {
      trxDiscount: true,
      makerRate: "0.000234",
      takerRate: "0.000189",
      volume30D: "0.0000550",
      specialFeeRates: [
        {
          symbol: "USDD_USDT",
          makerRate: "0.00",
          takerRate: "0.00",
        },
        {
          symbol: "LSK_BTC",
          makerRate: "0.02",
          takerRate: "0.01",
        },
      ],
    };
    const uri = `/feeinfo`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, fees);
    const data = await client.getFeeInfo();
    (0, node_assert_1.deepStrictEqual)(data, fees);
  });
  test(".getWallets()", async () => {
    const currency = "ATOM";
    const wallet = {
      [currency]: "cosmos18clcz526q274gdvmjv820f45pua03rhn4xplkz",
    };
    const uri = `/wallets/addresses`;
    const url = new URL(uri, client.base_url);
    const method = "GET";
    const query = { currency };
    mockPool
      .intercept({
        path: url.pathname,
        method,
        headers,
        query: { ...query, signTimestamp },
      })
      .reply(200, wallet);
    const data = await client.getWallets(query);
    (0, node_assert_1.deepStrictEqual)(data, wallet);
  });
  test(".getWallets() (with no `currency`)", async () => {
    const wallets = {
      AAVE: "0xae8d0d7c520daebb1580dabaa91f3ccf8ae492f5",
      AMP: "0xae8d0d7c520daebb1580dabaa91f3ccf8ae492f5",
      ATOM: "cosmos18clcz526q274gdvmjv820f45pua03rhn4xplkz",
      XLMBEAR: "0xae8d0d7c520daebb1580dabaa91f3ccf8ae492f5",
      XLMBULL: "0xae8d0d7c520daebb1580dabaa91f3ccf8ae492f5",
      XYM: "bqz8hDK2mm",
    };
    const uri = `/wallets/addresses`;
    const url = new URL(uri, client.base_url);
    const method = "GET";
    mockPool
      .intercept({
        path: url.pathname,
        method,
        headers,
        query: { signTimestamp },
      })
      .reply(200, wallets);
    const data = await client.getWallets();
    (0, node_assert_1.deepStrictEqual)(data, wallets);
  });
  test(".getWalletsActivity()", async () => {
    const activity = {
      deposits: [
        {
          depositNumber: 7397520,
          currency: "BTC",
          address: "131rdg5Rzn6BFufnnQaHhVa5ZtRU1J2EZR",
          amount: "0.06830697",
          confirmations: 1,
          txid: "3a4b9b2404f6e6fb556c3e1d46a9752f5e70a93ac1718605c992b80aacd8bd1d",
          timestamp: 1506005439,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397521,
          currency: "BCH",
          address: "1FhCkdKeMGa621mCpAtFYzeVfUBnHbooLj",
          amount: "10.00000000",
          confirmations: 5,
          txid: "eb2e0914105b02fbe6e17913d74b4e5950c1ba122eb71afdfc49e2c58b272456",
          timestamp: 1508436102,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397518,
          currency: "ETH",
          address: "0xb7e033598cb94ef5a35349316d3a2e4f95f308da",
          amount: "29.99825341",
          confirmations: 53,
          txid: "f7e7eeb44edcad14c0f90a5fffb1cbb4b80e8f9652124a0838f6906ca939ccd2",
          timestamp: 1537305507,
          status: "COMPLETED",
        },
      ],
      withdrawals: [
        {
          withdrawalRequestsId: 7397527,
          currency: "ETC",
          address: "0x26419a62055af459d2cd69bb7392f5100b75e304",
          amount: "13.19951600",
          fee: "0.01000000",
          timestamp: 1506010932,
          status: "COMPLETED",
          txid: "343346392f82ac16e8c2604f2a604b7b2382d0e9d8030f673821f8de4b5f5bk",
          ipAddress: "1.2.3.4",
          paymentID: null,
        },
        {
          withdrawalRequestsId: 7704882,
          currency: "ETH",
          address: "0x00c90335F92FfcD26C8c915c79d7aB424454B7c7",
          amount: "0.01318826",
          fee: "0.00500000",
          timestamp: 1507908127,
          status: "COMPLETED",
          txid: "423346392f82ac16e8c2604f2a604b7b2382d0e9d8030f673821f8de4b5f5a30",
          ipAddress: "1.2.3.4",
          paymentID: null,
        },
      ],
    };
    const end = Date.now();
    const start = Date.now() - 1000 * 60 * 60 * 24;
    const uri = `/wallets/activity`;
    const url = new URL(uri, client.base_url);
    const method = "GET";
    const query = { start, end };
    mockPool
      .intercept({
        path: url.pathname,
        method,
        headers,
        query: { ...query, signTimestamp },
      })
      .reply(200, activity);
    const data = await client.getWalletsActivity(query);
    (0, node_assert_1.deepStrictEqual)(data, activity);
  });
  test(".getWalletsActivity() (with `Date` instead of `number`)", async () => {
    const activity = {
      deposits: [
        {
          depositNumber: 7397520,
          currency: "BTC",
          address: "131rdg5Rzn6BFufnnQaHhVa5ZtRU1J2EZR",
          amount: "0.06830697",
          confirmations: 1,
          txid: "3a4b9b2404f6e6fb556c3e1d46a9752f5e70a93ac1718605c992b80aacd8bd1d",
          timestamp: 1506005439,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397521,
          currency: "BCH",
          address: "1FhCkdKeMGa621mCpAtFYzeVfUBnHbooLj",
          amount: "10.00000000",
          confirmations: 5,
          txid: "eb2e0914105b02fbe6e17913d74b4e5950c1ba122eb71afdfc49e2c58b272456",
          timestamp: 1508436102,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397518,
          currency: "ETH",
          address: "0xb7e033598cb94ef5a35349316d3a2e4f95f308da",
          amount: "29.99825341",
          confirmations: 53,
          txid: "f7e7eeb44edcad14c0f90a5fffb1cbb4b80e8f9652124a0838f6906ca939ccd2",
          timestamp: 1537305507,
          status: "COMPLETED",
        },
      ],
      withdrawals: [
        {
          withdrawalRequestsId: 7397527,
          currency: "ETC",
          address: "0x26419a62055af459d2cd69bb7392f5100b75e304",
          amount: "13.19951600",
          fee: "0.01000000",
          timestamp: 1506010932,
          status: "COMPLETED",
          txid: "343346392f82ac16e8c2604f2a604b7b2382d0e9d8030f673821f8de4b5f5bk",
          ipAddress: "1.2.3.4",
          paymentID: null,
        },
        {
          withdrawalRequestsId: 7704882,
          currency: "ETH",
          address: "0x00c90335F92FfcD26C8c915c79d7aB424454B7c7",
          amount: "0.01318826",
          fee: "0.00500000",
          timestamp: 1507908127,
          status: "COMPLETED",
          txid: "423346392f82ac16e8c2604f2a604b7b2382d0e9d8030f673821f8de4b5f5a30",
          ipAddress: "1.2.3.4",
          paymentID: null,
        },
      ],
    };
    const end = new Date();
    const start = new Date(end.getTime() - 1000 * 60 * 60 * 24);
    const uri = `/wallets/activity`;
    const url = new URL(uri, client.base_url);
    const method = "GET";
    const options = { start, end };
    const query = {
      start: options.start.getTime(),
      end: options.end.getTime(),
    };
    mockPool
      .intercept({
        path: url.pathname,
        method,
        headers,
        query: { ...query, signTimestamp },
      })
      .reply(200, activity);
    const data = await client.getWalletsActivity(options);
    (0, node_assert_1.deepStrictEqual)(data, activity);
  });
  test(".getWalletsActivity() (with `activityType`)", async () => {
    const activity = {
      deposits: [
        {
          depositNumber: 7397520,
          currency: "BTC",
          address: "131rdg5Rzn6BFufnnQaHhVa5ZtRU1J2EZR",
          amount: "0.06830697",
          confirmations: 1,
          txid: "3a4b9b2404f6e6fb556c3e1d46a9752f5e70a93ac1718605c992b80aacd8bd1d",
          timestamp: 1506005439,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397521,
          currency: "BCH",
          address: "1FhCkdKeMGa621mCpAtFYzeVfUBnHbooLj",
          amount: "10.00000000",
          confirmations: 5,
          txid: "eb2e0914105b02fbe6e17913d74b4e5950c1ba122eb71afdfc49e2c58b272456",
          timestamp: 1508436102,
          status: "COMPLETED",
        },
        {
          depositNumber: 7397518,
          currency: "ETH",
          address: "0xb7e033598cb94ef5a35349316d3a2e4f95f308da",
          amount: "29.99825341",
          confirmations: 53,
          txid: "f7e7eeb44edcad14c0f90a5fffb1cbb4b80e8f9652124a0838f6906ca939ccd2",
          timestamp: 1537305507,
          status: "COMPLETED",
        },
      ],
    };
    const activityType = "deposits";
    const end = (Date.now() / 1000) | 0;
    const start = end - 60 * 60 * 24;
    const options = { start, end, activityType };
    const uri = `/wallets/activity`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, activity);
    const data = await client.getWalletsActivity(query);
    (0, node_assert_1.deepStrictEqual)(data, activity);
  });
  test(".newAddress()", async () => {
    const address = {
      address: "0xae8d0d7c520daebb1580dabaa91f3ccf8ae492f5",
    };
    const currency = "TRX";
    const options = { currency };
    const uri = "/wallets/address";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, address);
    const data = await client.newAddress(options);
    (0, node_assert_1.deepStrictEqual)(data, address);
  });
  test(".withdraw()", async () => {
    const withdrawalRequestsId = 33485231;
    const currency = "ETH";
    const amount = "1.50";
    const address = "0xbb8d0d7c346daecc2380dabaa91f3ccf8ae232fb4";
    const options = { currency, amount, address };
    const uri = "/wallets/withdraw";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, { withdrawalRequestsId });
    const data = await client.withdraw(options);
    (0, node_assert_1.deepStrictEqual)(data, { withdrawalRequestsId });
  });
  test(".getMargin()", async () => {
    const info = {
      totalAccountValue: "24121.5",
      totalMargin: "21421.5",
      usedMargin: "2323.32",
      freeMargin: "2323.32",
      maintenanceMargin: "1231.4",
      marginRatio: "1739.61%",
      time: 1668542860395,
    };
    const accountType = "SPOT";
    const options = { accountType };
    const uri = "/margin/accountMargin";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, info);
    const data = await client.getMargin(options);
    (0, node_assert_1.deepStrictEqual)(data, info);
  });
  test(".getMargin() (with no `accountType`)", async () => {
    const info = {
      totalAccountValue: "24121.5",
      totalMargin: "21421.5",
      usedMargin: "2323.32",
      freeMargin: "2323.32",
      maintenanceMargin: "1231.4",
      marginRatio: "1739.61%",
      time: 1668542860395,
    };
    const accountType = "SPOT";
    const options = { accountType };
    const uri = "/margin/accountMargin";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, info);
    const data = await client.getMargin();
    (0, node_assert_1.deepStrictEqual)(data, info);
  });
  test(".getBorrowStatus()", async () => {
    const status = [
      {
        currency: "BTC",
        available: "0.0",
        borrowed: "-10.0",
        hold: "0.0",
        maxAvailable: "20.0",
        hourlyBorrowRate: "0.000045",
        version: "111",
      },
    ];
    const currency = "BTC";
    const options = { currency };
    const uri = "/margin/borrowStatus";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, status);
    const data = await client.getBorrowStatus(options);
    (0, node_assert_1.deepStrictEqual)(data, status);
  });
  test(".getBorrowStatus() (with no `currency`)", async () => {
    const status = [
      {
        currency: "BTC",
        available: "0.0",
        borrowed: "-10.0",
        hold: "0.0",
        maxAvailable: "20.0",
        hourlyBorrowRate: "0.000045",
        version: "111",
      },
      {
        currency: "ETH",
        available: "100",
        borrowed: "0.0",
        hold: "0.0",
        maxAvailable: "200",
        hourlyBorrowRate: "0.000045",
        version: "122",
      },
    ];
    const uri = "/margin/borrowStatus";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, status);
    const data = await client.getBorrowStatus();
    (0, node_assert_1.deepStrictEqual)(data, status);
  });
  test(".getMaxSize()", async () => {
    const size = {
      symbol: "BTC_USDT",
      maxLeverage: 3,
      availableBuy: "10000.0",
      maxAvailableBuy: "10000.0",
      availableSell: "1.0",
      maxAvailableSell: "2.0",
    };
    const symbol = "BTC_USDT";
    const options = { symbol };
    const uri = "/margin/maxSize";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, size);
    const data = await client.getMaxSize(options);
    (0, node_assert_1.deepStrictEqual)(data, size);
  });
  test(".getMaxSize() (with no `currency`)", async () => {
    const size = {
      symbol: "BTC_USDT",
      maxLeverage: 3,
      availableBuy: "10000.0",
      maxAvailableBuy: "10000.0",
      availableSell: "1.0",
      maxAvailableSell: "2.0",
    };
    const { symbol } = client;
    const options = { symbol };
    const uri = "/margin/maxSize";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, size);
    const data = await client.getMaxSize();
    (0, node_assert_1.deepStrictEqual)(data, size);
  });
  test(".createOrder()", async () => {
    const response = { id: "29772698821328896", clientOrderId: "1234Abc" };
    const symbol = "BTC_USDT";
    const type = "LIMIT";
    const quantity = "100";
    const side = "BUY";
    const price = "40000.50000";
    const timeInForce = "IOC";
    const clientOrderId = "1234Abc";
    const options = {
      symbol,
      type,
      quantity,
      side,
      price,
      timeInForce,
      clientOrderId,
    };
    const uri = "/orders";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.createOrder(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".createOrder() (with no `clientOrderId`)", async () => {
    const response = { id: "2977269882132774", clientOrderId: "" };
    const symbol = "BTC_USDT";
    const quantity = "100";
    const side = "BUY";
    const options = { symbol, quantity, side };
    const uri = "/orders";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.createOrder(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".createOrders()", async () => {
    const response = [
      { id: "2977269882132774", clientOrderId: "" },
      { id: "29772698821328896", clientOrderId: "1234Abc" },
      { code: 21709, message: "Low available balance", clientOrderId: "" },
      {
        code: 21312,
        message: "Client order id repeat",
        clientOrderId: "456Xyz",
      },
    ];
    const options = [
      { symbol: "BTC_USDT", amount: "100", side: "BUY" },
      {
        symbol: "BTC_USDT",
        type: "LIMIT",
        quantity: "100",
        side: "BUY",
        price: "40000.50000",
        timeInForce: "IOC",
        clientOrderId: "1234Abc",
      },
      {
        symbol: "ETH_USDT",
        amount: "1000",
        side: "BUY",
      },
      {
        symbol: "TRX_USDT",
        type: "LIMIT",
        quantity: "15000",
        side: "SELL",
        price: "0.0623423423",
        timeInForce: "IOC",
        clientOrderId: "456Xyz",
      },
    ];
    const uri = "/orders/batch";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.createOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".createOrders() (with an empty array)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.createOrders([]),
      new TypeError("Empty arrays are not allowed")
    );
  });
  test(".replaceOrder()", async () => {
    const clientOrderId = "1234Abc";
    const response = { id: "29772698821328896", clientOrderId };
    const id = "234235233423";
    const price = "18000";
    const options = { price, clientOrderId };
    const uri = `/orders/${id}`;
    const method = "PUT";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.replaceOrder({ id }, options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".replaceOrder() (with `clientOrderId`)", async () => {
    const response = {
      id: "29772698821328896",
      clientOrderId: "1234Abcd",
    };
    const clientOrderId = "1234Abc";
    const price = "18000";
    const quantity = "20";
    const options = { price, quantity };
    const uri = `/orders/cid:${clientOrderId}`;
    const method = "PUT";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.replaceOrder({ clientOrderId }, options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".replaceOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.replaceOrder({}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".getOpenOrders()", async () => {
    const orders = [
      {
        id: "24993088082542592",
        clientOrderId: "",
        symbol: "ELON_USDC",
        state: "NEW",
        accountType: "SPOT",
        side: "SELL",
        type: "MARKET",
        timeInForce: "GTC",
        quantity: "1.00",
        price: "0.00",
        avgPrice: "0.00",
        amount: "0.00",
        filledQuantity: "0.00",
        filledAmount: "0.00",
        createTime: 1646925216548,
        updateTime: 1646925216548,
      },
    ];
    const symbol = "ELON_USDC";
    const side = "SELL";
    const from = 0;
    const direction = "PRE";
    const limit = 10;
    const options = { symbol, side, from, direction, limit };
    const uri = "/orders";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOpenOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getOpenOrders() (with no options)", async () => {
    const orders = [
      {
        id: "24993088082542592",
        clientOrderId: "",
        symbol: "ELON_USDC",
        state: "NEW",
        accountType: "SPOT",
        side: "SELL",
        type: "MARKET",
        timeInForce: "GTC",
        quantity: "1.00",
        price: "0.00",
        avgPrice: "0.00",
        amount: "0.00",
        filledQuantity: "0.00",
        filledAmount: "0.00",
        createTime: 1646925216548,
        updateTime: 1646925216548,
      },
      {
        id: "21934611974062080",
        clientOrderId: "123",
        symbol: "TRX_USDC",
        state: "NEW",
        accountType: "SPOT",
        side: "SELL",
        type: "LIMIT",
        timeInForce: "GTC",
        quantity: "1.00",
        price: "10.00",
        avgPrice: "0.00",
        amount: "0.00",
        filledQuantity: "0.00",
        filledAmount: "0.00",
        createTime: 1646196019020,
        updateTime: 1646196019020,
      },
    ];
    const uri = "/orders";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOpenOrders();
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getOrder()", async () => {
    const order = {
      id: "21934611974062080",
      clientOrderId: "123",
      symbol: "TRX_USDC",
      state: "NEW",
      accountType: "SPOT",
      side: "SELL",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: "1.00",
      price: "10.00",
      avgPrice: "0.00",
      amount: "0.00",
      filledQuantity: "0.00",
      filledAmount: "0.00",
      createTime: 1646196019020,
      updateTime: 1646196019020,
    };
    const id = "21934611974062080";
    const uri = `/orders/${id}`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, order);
    const data = await client.getOrder({ id });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".getOrder() (with `clientOrderId`)", async () => {
    const order = {
      id: "21934611974062080",
      clientOrderId: "123",
      symbol: "TRX_USDC",
      state: "NEW",
      accountType: "SPOT",
      side: "SELL",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: "1.00",
      price: "10.00",
      avgPrice: "0.00",
      amount: "0.00",
      filledQuantity: "0.00",
      filledAmount: "0.00",
      createTime: 1646196019020,
      updateTime: 1646196019020,
    };
    const clientOrderId = "21934611974062080";
    const uri = `/orders/cid:${clientOrderId}`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, order);
    const data = await client.getOrder({ clientOrderId });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".getOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.getOrder({}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".cancelOrder()", async () => {
    const orderId = "32487004629499904";
    const order = {
      orderId,
      clientOrderId: "54321",
      state: "PENDING_CANCEL",
      code: 200,
      message: "",
    };
    const uri = `/orders/${orderId}`;
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers };
    mockPool.intercept(intercept_options).reply(200, order);
    const data = await client.cancelOrder({ id: orderId });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".cancelOrder() (with `clientOrderId`)", async () => {
    const clientOrderId = "54321";
    const order = {
      orderId: "32487004629499904",
      clientOrderId,
      state: "PENDING_CANCEL",
      code: 200,
      message: "",
    };
    const uri = `/orders/cid:${clientOrderId}`;
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers };
    mockPool
      .intercept(intercept_options)
      .reply(200, order, { headers: { "Content-Type": "application:json" } });
    const data = await client.cancelOrder({ clientOrderId });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".cancelOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.cancelOrder({}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".cancelOrders()", async () => {
    const response = [
      {
        orderId: "12345",
        clientOrderId: "33344",
        state: "PENDING_CANCEL",
        code: 200,
        message: "",
      },
      {
        orderId: "67890",
        clientOrderId: "myId-1",
        state: "PENDING_CANCEL",
        code: 200,
        message: "",
      },
    ];
    const orders = [{ id: "12345" }, { clientOrderId: "myId-1" }];
    const options = { orderIds: ["12345"], clientOrderIds: ["myId-1"] };
    const uri = "/orders/cancelByIds";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelOrders(orders);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".cancelOrders() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.cancelOrders([]),
      new TypeError("No orders to cancel")
    );
  });
  test(".cancelAllOrders()", async () => {
    const response = [
      {
        orderId: "111222333444",
        clientOrderId: "666666",
        state: "PENDING_CANCEL",
        code: 200,
        message: "SUCCESS",
      },
      {
        orderId: "333444555666",
        clientOrderId: "777777",
        state: "PENDING_CANCEL",
        code: 200,
        message: "SUCCESS",
      },
    ];
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const accountTypes = ["SPOT"];
    const options = { symbols, accountTypes };
    const uri = "/orders";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelAllOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".cancelAllOrders() (with no options)", async () => {
    const response = [
      {
        orderId: "111222333444",
        clientOrderId: "666666",
        state: "PENDING_CANCEL",
        code: 200,
        message: "SUCCESS",
      },
      {
        orderId: "333444555666",
        clientOrderId: "777777",
        state: "PENDING_CANCEL",
        code: 200,
        message: "SUCCESS",
      },
    ];
    const uri = "/orders";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body({}) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelAllOrders();
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".killSwitch()", async () => {
    const status = {
      startTime: "1665456130",
      cancellationTime: "1665456190",
    };
    const timeout = 60;
    const options = { timeout: timeout.toString() };
    const uri = "/orders/killSwitch";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, status);
    const data = await client.killSwitch({ timeout });
    (0, node_assert_1.deepStrictEqual)(data, status);
  });
  test(".killSwitch() (with invalid `timeout`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.killSwitch({ timeout: 40.2 }),
      new TypeError("Invalid timeout value")
    );
    await (0, node_assert_1.rejects)(
      () => client.killSwitch({ timeout: 9 }),
      new TypeError("Invalid timeout value")
    );
    await (0, node_assert_1.rejects)(
      () => client.killSwitch({ timeout: 601 }),
      new TypeError("Invalid timeout value")
    );
  });
  test(".getKillSwitch()", async () => {
    const status = {
      startTime: "1665456130",
      cancellationTime: "1665456190",
    };
    const uri = "/orders/killSwitchStatus";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, status);
    const data = await client.getKillSwitch();
    (0, node_assert_1.deepStrictEqual)(data, status);
  });
  test(".createSmartOrder()", async () => {
    const clientOrderId = "999999910";
    const response = { id: "10000009", clientOrderId };
    const symbol = "BTC_USDT";
    const type = "STOP_LIMIT";
    const quantity = "100";
    const side = "BUY";
    const price = "60100.00";
    const timeInForce = "FOK";
    const stopPrice = "60000.00";
    const options = {
      symbol,
      type,
      quantity,
      side,
      price,
      timeInForce,
      clientOrderId,
      stopPrice,
    };
    const uri = "/smartorders";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.createSmartOrder(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".createSmartOrder() (with no `clientOrderId`)", async () => {
    const response = { id: "2977269882132774", clientOrderId: "" };
    const symbol = "BTC_USDT";
    const quantity = "100";
    const stopPrice = "60000.00";
    const side = "BUY";
    const options = { symbol, quantity, side, stopPrice };
    const uri = "/smartorders";
    const method = "POST";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.createSmartOrder(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".cancelSmartOrder()", async () => {
    const orderId = "9876543";
    const order = {
      orderId,
      clientOrderId: "88888",
      state: "CANCELED",
      code: 200,
      message: "",
    };
    const uri = `/smartorders/${orderId}`;
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers };
    mockPool.intercept(intercept_options).reply(200, order);
    const data = await client.cancelSmartOrder({ id: orderId });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".replaceSmartOrder()", async () => {
    const id = "29772698821328896";
    const clientOrderId = "1234Abc";
    const response = { id, clientOrderId };
    const stopPrice = "18000";
    const options = { stopPrice, clientOrderId };
    const uri = `/smartorders/${id}`;
    const method = "PUT";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.replaceSmartOrder({ id }, options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".replaceSmartOrder() (with `clientOrderId`)", async () => {
    const response = { id: "29772698821328896", clientOrderId: "" };
    const clientOrderId = "1234Abc";
    const stopPrice = "18000";
    const quantity = "20";
    const options = { stopPrice, quantity };
    const uri = `/smartorders/cid:${clientOrderId}`;
    const method = "PUT";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.replaceSmartOrder({ clientOrderId }, options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".replaceSmartOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.replaceSmartOrder({}, {}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".getOpenSmartOrders()", async () => {
    const orders = [
      {
        id: "999991586827571200",
        clientOrderId: "",
        symbol: "ETH_USDT",
        state: "PENDING_NEW",
        accountType: "SPOT",
        side: "BUY",
        type: "STOP_LIMIT",
        timeInForce: "GTC",
        quantity: "0.036",
        price: "1",
        amount: "0.00",
        stopPrice: "3750.00",
        createTime: 1630832295888,
        updateTime: 1630832295888,
      },
      {
        id: "999991586827571288",
        clientOrderId: "100832",
        symbol: "BTC_USDT",
        state: "PENDING_NEW",
        accountType: "SPOT",
        side: "SELL",
        type: "STOP_LIMIT",
        timeInForce: "GTC",
        quantity: "0.015",
        price: "11",
        amount: "0.00",
        stopPrice: "55500.00",
        createTime: 1630832298765,
        updateTime: 1630832298765,
      },
    ];
    const limit = 10;
    const options = { limit };
    const uri = "/smartorders";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { ...options, signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOpenSmartOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getOpenSmartOrders() (with no options)", async () => {
    const orders = [
      {
        id: "999991586827571200",
        clientOrderId: "",
        symbol: "ETH_USDT",
        state: "PENDING_NEW",
        accountType: "SPOT",
        side: "BUY",
        type: "STOP_LIMIT",
        timeInForce: "GTC",
        quantity: "0.036",
        price: "1",
        amount: "0.00",
        stopPrice: "3750.00",
        createTime: 1630832295888,
        updateTime: 1630832295888,
      },
      {
        id: "999991586827571288",
        clientOrderId: "100832",
        symbol: "BTC_USDT",
        state: "PENDING_NEW",
        accountType: "SPOT",
        side: "SELL",
        type: "STOP_LIMIT",
        timeInForce: "GTC",
        quantity: "0.015",
        price: "11",
        amount: "0.00",
        stopPrice: "55500.00",
        createTime: 1630832298765,
        updateTime: 1630832298765,
      },
    ];
    const uri = "/smartorders";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOpenSmartOrders();
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getSmartOrder()", async () => {
    const id = "14368195657859072";
    const order = {
      id: "14368195657859072",
      clientOrderId: "18113",
      symbol: "BTC_USDT",
      state: "TRIGGERED",
      accountType: "SPOT",
      side: "BUY",
      type: "STOP",
      timeInForce: "GTC",
      quantity: "0.2",
      price: "41920",
      amount: "10",
      stopPrice: "41946",
      createTime: 1644392044793,
      updateTime: 0,
      triggeredOrder: {
        id: "24106600339865600",
        clientOrderId: "18113",
        symbol: "BTC_USDT",
        state: "PARTIALLY_FILLED",
        accountType: "SPOT",
        side: "BUY",
        type: "MARKET",
        timeInForce: "GTC",
        quantity: "0.00",
        price: "0.00",
        avgPrice: "39991.10",
        amount: "10.00",
        filledQuantity: "0.00025005",
        filledAmount: "9.999774555",
        createTime: 1646713861400,
        updateTime: 1646713861400,
      },
    };
    const uri = `/smartorders/${id}`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, [order]);
    const data = await client.getSmartOrder({ id });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".getSmartOrder() (with `clientOrderId`)", async () => {
    const clientOrderId = "124";
    const uri = `/smartorders/cid:${clientOrderId}`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, []);
    const data = await client.getSmartOrder({ clientOrderId });
    (0, node_assert_1.deepStrictEqual)(data, null);
  });
  test(".getSmartOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.getSmartOrder({}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".cancelSmartOrder() (with `clientOrderId`)", async () => {
    const clientOrderId = "88888";
    const order = {
      orderId: "9876543",
      clientOrderId,
      state: "CANCELED",
      code: 200,
      message: "",
    };
    const uri = `/smartorders/cid:${clientOrderId}`;
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers };
    mockPool.intercept(intercept_options).reply(200, order);
    const data = await client.cancelSmartOrder({ clientOrderId });
    (0, node_assert_1.deepStrictEqual)(data, order);
  });
  test(".cancelSmartOrder() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.cancelSmartOrder({}),
      new TypeError("Either `id` or `clientOrderId` is missing")
    );
  });
  test(".cancelSmartOrders()", async () => {
    const response = [
      {
        orderId: "9876543",
        clientOrderId: "88888",
        state: "CANCELED",
        code: 200,
        message: "",
      },
      {
        orderId: "111222333",
        clientOrderId: "myId-2",
        state: "CANCELED",
        code: 200,
        message: "",
      },
    ];
    const orders = [{ id: "12345" }, { clientOrderId: "myId-21" }];
    const options = { orderIds: ["12345"], clientOrderIds: ["myId-21"] };
    const uri = "/smartorders/cancelByIds";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelSmartOrders(orders);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".cancelSmartOrders() (with no `id ` and `clientOrderId`)", async () => {
    await (0, node_assert_1.rejects)(
      () => client.cancelSmartOrders([]),
      new TypeError("No smart orders to cancel")
    );
  });
  test(".cancelAllSmartOrders()", async () => {
    const response = [
      {
        orderId: "1111111111",
        clientOrderId: "aaaaa",
        state: "CANCELED",
        code: 200,
        message: "SUCCESS",
      },
      {
        orderId: "222222222",
        clientOrderId: "",
        state: "CANCELED",
        code: 200,
        message: "SUCCESS",
      },
    ];
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const accountTypes = ["SPOT"];
    const options = { symbols, accountTypes };
    const uri = "/smartorders";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body(options) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelAllSmartOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".cancelAllSmartOrders() (with no options)", async () => {
    const response = [
      {
        orderId: "1111111111",
        clientOrderId: "aaaaa",
        state: "CANCELED",
        code: 200,
        message: "SUCCESS",
      },
      {
        orderId: "222222222",
        clientOrderId: "",
        state: "CANCELED",
        code: 200,
        message: "SUCCESS",
      },
    ];
    const uri = "/smartorders";
    const method = "DELETE";
    const { pathname: path } = new URL(uri, client.base_url);
    const intercept_options = { path, method, headers, body: body({}) };
    mockPool.intercept(intercept_options).reply(200, response);
    const data = await client.cancelAllSmartOrders();
    (0, node_assert_1.deepStrictEqual)(data, response);
  });
  test(".getOrders()", async () => {
    const orders = [
      {
        id: "35490370041151490",
        clientOrderId: "Try1",
        symbol: "TRX_USDC",
        accountType: "SPOT",
        side: "SELL",
        type: "LIMIT_MAKER",
        timeInForce: "GTC",
        price: "3333",
        avgPrice: "0",
        quantity: "5",
        amount: "0",
        filledQuantity: "0",
        filledAmount: "0",
        state: "CANCELED",
        orderSource: "API",
        createTime: 1649427963597,
        updateTime: 1649427963597,
      },
      {
        id: "34141303381950464",
        clientOrderId: "223ABD",
        symbol: "TRX_USDC",
        accountType: "SPOT",
        side: "BUY",
        type: "LIMIT",
        timeInForce: "GTC",
        price: "1.05",
        avgPrice: "0.06023436",
        quantity: "10",
        amount: "0",
        filledQuantity: "10",
        filledAmount: "0.6023436",
        state: "FILLED",
        orderSource: "API",
        createTime: 1649106321041,
        updateTime: 1649106321041,
      },
    ];
    const accountType = "SPOT";
    const type = ["MARKET", "LIMIT"];
    const side = "BUY";
    const symbol = "TRX_USDC";
    const from = "0";
    const direction = "PRE";
    const states = ["FILLED", "PARTIALLY_CANCELED"];
    const limit = 10;
    const hideCancel = true;
    const startTime = 1649106321040;
    const endTime = 1649427963598;
    const options = {
      accountType,
      type,
      side,
      symbol,
      from,
      direction,
      states,
      limit,
      hideCancel,
      startTime,
      endTime,
    };
    const uri = "/orders/history";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = {
      ...options,
      states: options.states.toString(),
      type: options.type.toString(),
      signTimestamp,
    };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOrders(options);
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getOrders() (with no `options`)", async () => {
    const orders = [
      {
        id: "35490370041151490",
        clientOrderId: "Try1",
        symbol: "TRX_USDC",
        accountType: "SPOT",
        side: "SELL",
        type: "LIMIT_MAKER",
        timeInForce: "GTC",
        price: "3333",
        avgPrice: "0",
        quantity: "5",
        amount: "0",
        filledQuantity: "0",
        filledAmount: "0",
        state: "CANCELED",
        orderSource: "API",
        createTime: 1649427963597,
        updateTime: 1649427963597,
      },
      {
        id: "34141303381950464",
        clientOrderId: "223ABD",
        symbol: "TRX_USDC",
        accountType: "SPOT",
        side: "BUY",
        type: "LIMIT",
        timeInForce: "GTC",
        price: "1.05",
        avgPrice: "0.06023436",
        quantity: "10",
        amount: "0",
        filledQuantity: "10",
        filledAmount: "0.6023436",
        state: "FILLED",
        orderSource: "API",
        createTime: 1649106321041,
        updateTime: 1649106321041,
      },
    ];
    const uri = "/orders/history";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, orders);
    const data = await client.getOrders();
    (0, node_assert_1.deepStrictEqual)(data, orders);
  });
  test(".getTrades()", async () => {
    const trades = [
      {
        id: "62561238",
        symbol: "LINK_USDT",
        accountType: "SPOT",
        orderId: "32164923987566592",
        side: "SELL",
        type: "MARKET",
        matchRole: "TAKER",
        createTime: 1648635115525,
        price: "11",
        quantity: "0.5",
        amount: "5.5",
        feeCurrency: "USDT",
        feeAmount: "0.007975",
        pageId: "32164924331503616",
        clientOrderId: "myOwnId-321",
        loan: false,
      },
    ];
    const limit = 10;
    const endTime = 1648635115535;
    const startTime = 1648635115515;
    const direction = "PRE";
    const symbols = ["BTC_USDT", "ETH_USDT"];
    const options = { limit, endTime, startTime, direction, symbols };
    const uri = "/trades";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = {
      ...options,
      symbols: options.symbols.toString(),
      signTimestamp,
    };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, trades);
    const data = await client.getTrades(options);
    (0, node_assert_1.deepStrictEqual)(data, trades);
  });
  test(".getTrades() (with no `options`)", async () => {
    const trades = [
      {
        id: "62561238",
        symbol: "LINK_USDT",
        accountType: "SPOT",
        orderId: "32164923987566592",
        side: "SELL",
        type: "MARKET",
        matchRole: "TAKER",
        createTime: 1648635115525,
        price: "11",
        quantity: "0.5",
        amount: "5.5",
        feeCurrency: "USDT",
        feeAmount: "0.007975",
        pageId: "32164924331503616",
        clientOrderId: "myOwnId-321",
        loan: false,
      },
    ];
    const uri = "/trades";
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, trades);
    const data = await client.getTrades();
    (0, node_assert_1.deepStrictEqual)(data, trades);
  });
  test(".getOrderTrades()", async () => {
    const trades = [
      {
        id: "68561226",
        symbol: "LINK_USDT",
        accountType: "SPOT",
        orderId: "30249408733945856",
        side: "BUY",
        type: "LIMIT",
        matchRole: "MAKER",
        createTime: 1648200366864,
        price: "3.1",
        quantity: "1",
        amount: "3.1",
        feeCurrency: "LINK",
        feeAmount: "0.00145",
        pageId: "30341456333942784",
        clientOrderId: "",
      },
    ];
    const id = "30249408733945856";
    const uri = `/orders/${id}/trades`;
    const method = "GET";
    const { pathname: path } = new URL(uri, client.base_url);
    const query = { signTimestamp };
    const intercept_options = { path, method, headers, query };
    mockPool.intercept(intercept_options).reply(200, trades);
    const data = await client.getOrderTrades({ id });
    (0, node_assert_1.deepStrictEqual)(data, trades);
  });
});
