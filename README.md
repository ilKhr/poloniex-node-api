# Poloniex Node.js API [![CircleCI](https://circleci.com/gh/vansergen/poloniex-node-api.svg?style=svg)](https://circleci.com/gh/vansergen/poloniex-node-api) [![GitHub version](https://badge.fury.io/gh/vansergen%2Fpoloniex-node-api.svg)](https://badge.fury.io/gh/vansergen%2Fpoloniex-node-api) [![npm version](https://badge.fury.io/js/poloniex-node-api.svg)](https://badge.fury.io/js/poloniex-node-api) [![languages](https://img.shields.io/github/languages/top/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![dependency status](https://img.shields.io/librariesio/github/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![repo size](https://img.shields.io/github/repo-size/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![npm downloads](https://img.shields.io/npm/dt/poloniex-node-api.svg)](https://www.npmjs.com/package/poloniex-node-api) [![license](https://img.shields.io/github/license/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api/blob/master/LICENSE)

Node.js library for [Poloniex](https://docs.poloniex.com/).

## Installation

```bash
npm install poloniex-node-api
```

## Usage

### [PublicClient](https://docs.poloniex.com/#public-http-api-methods)

```typescript
import { PublicClient } from "poloniex-node-api";
const client = new PublicClient();
```

- [`getTickers`](https://docs.poloniex.com/?shell#returnticker)

```typescript
const tickers = await client.getTickers();
```

- [`getVolume`](https://docs.poloniex.com/?shell#return24hvolume)

```typescript
const volume = await client.getVolume();
```

- [`getOrderBook`](https://docs.poloniex.com/?shell#returnorderbook)

```typescript
const currencyPair = "USDT_BTC";
const depth = 25;
const book = await client.getOrderBook({ currencyPair, depth });
```

- [`getTradeHistory`](https://docs.poloniex.com/?shell#returntradehistory-public)

```typescript
const currencyPair = "currencyPair";
const start = 1410158341;
const end = 1410499372;
const trades = await client.getTradeHistory({ currencyPair, start, end });
```

- [`getChartData`](https://docs.poloniex.com/?shell#returnchartdata)

```typescript
const currencyPair = "BTC_XMR";
const period = 14400;
const start = 1546300800;
const end = 1546646400;
const candles = await client.getChartData({ currencyPair, period, start, end });
```

- [`getCurrencies`](https://docs.poloniex.com/?shell#returncurrencies)

```typescript
const currencies = await client.getCurrencies();
```

- [`getLoanOrders`](https://docs.poloniex.com/?shell#returnloanorders)

```typescript
const currency = "USDT";
const loans = await client.getLoanOrders({ currency });
```

### [AuthenticatedClient](https://docs.poloniex.com/#private-http-api-methods)

```typescript
import { AuthenticatedClient } from "poloniex-node-api";
const key = "poloniexapikey";
const secret = "poloniexapisecret";
const client = new AuthenticatedClient({ key, secret });
```

- [`getBalances`](https://docs.poloniex.com/?shell#returnbalances)

```typescript
const balances = await client.getBalances();
```

- [`getCompleteBalances`](https://docs.poloniex.com/?shell#returncompletebalances)

```typescript
const account = "all";
const balances = await client.getCompleteBalances({ account });
```

- [`getDepositAddresses`](https://docs.poloniex.com/?shell#returndepositaddresses)

```typescript
const addresses = await client.getDepositAddresses();
```

- [`getNewAddress`](https://docs.poloniex.com/?shell#generatenewaddress)

```typescript
const currency = "ZEC";
const addresses = await client.getNewAddress({ currency });
```

- [`getDepositsWithdrawals`](https://docs.poloniex.com/?shell#returndepositswithdrawals)

```typescript
const start = 1539954535;
const end = 1540314535;
const result = await client.getDepositsWithdrawals({ start, end });
```

- [`getOpenOrders`](https://docs.poloniex.com/?shell#returnopenorders)

```typescript
const currencyPair = "BTC_DASH";
const orders = await client.getOpenOrders({ currencyPair });
```

- [`getHistoryTrades`](https://docs.poloniex.com/?shell#returntradehistory-private)

```typescript
const currencyPair = "BTC_ETC";
const start = 1573953463;
const end = 1576588663;
const limit = 5000;
const trades = await client.getHistoryTrades({
  currencyPair,
  start,
  end,
  limit
});
```

- [`getOrderTrades`](https://docs.poloniex.com/?shell#returntradehistory-private)

```typescript
const orderNumber = 96238912842;
const trades = await client.getOrderTrades({ orderNumber });
```

- [`getOrderStatus`](https://docs.poloniex.com/?shell#returnorderstatus)

```typescript
const orderNumber = 96238912842;
const trades = await client.getOrderStatus({ orderNumber });
```

- [`buy`](https://docs.poloniex.com/?shell#buy)

```typescript
const currencyPair = "BTC_ETH";
const rate = 0.01;
const amount = 1;
const clientOrderId = 12345;
const postOnly = 1;
const order = await client.buy({
  currencyPair,
  rate,
  amount,
  postOnly,
  clientOrderId
});
```

- [`sell`](https://docs.poloniex.com/?shell#sell)

```typescript
const currencyPair = "BTC_ETH";
const rate = 10;
const amount = 1;
const order = await client.sell({ currencyPair, rate, amount });
```

- [`cancelOrder`](https://docs.poloniex.com/?shell#cancelorder)

```typescript
const orderNumber = 514845991795;
let result = await client.cancelOrder({ orderNumber });
// or by `clientOrderId`
const clientOrderId = 12345;
result = await client.cancelOrder({ clientOrderId });
```

- [`cancelAllOrders`](https://docs.poloniex.com/?shell#cancelallorders)

```typescript
const currencyPair = "BTC_ETH";
const orders = await client.cancelAllOrders({ currencyPair });
```

- [`moveOrder`](https://docs.poloniex.com/?shell#moveorder)

```typescript
const orderNumber = 514851026755;
const rate = 0.00015;
const clientOrderId = 12345;
const result = await client.moveOrder({ rate, orderNumber, clientOrderId });
```

- [`withdraw`](https://docs.poloniex.com/?shell#withdraw)

```typescript
const currency = "EOS";
const amount = 1000;
const address = "eos-address";
const paymentId = 1234567890;
const result = await client.withdraw({
  currency,
  amount,
  address,
  paymentId
});
```

- [`getFeeInfo`](https://docs.poloniex.com/?shell#returnfeeinfo)

```typescript
const fees = await client.getFeeInfo();
```

- [`getAccountBalances`](https://docs.poloniex.com/?shell#returnavailableaccountbalances)

```typescript
const account = "lending";
const balances = client.getAccountBalances({ account });
```

- [`getTradableBalances`](https://docs.poloniex.com/?shell#returntradablebalances)

```typescript
const balances = client.getTradableBalances();
```

- [`transferBalance`](https://docs.poloniex.com/?shell#transferbalance)

```typescript
const currency = "BTC";
const amount = 0.5;
const fromAccount = "lending";
const toAccount = "exchange";
const transfer = client.transferBalance({
  currency,
  amount,
  fromAccount,
  toAccount
});
```

- [`getMarginSummary`](https://docs.poloniex.com/?shell#returnmarginaccountsummary)

```typescript
const summary = await client.getMarginSummary();
```

- [`marginBuy`](https://docs.poloniex.com/?shell#marginbuy)

```typescript
const currencyPair = "BTC_ETH";
const rate = 0.01;
const amount = 1;
const lendingRate = 0.01;
const order = await client.marginBuy({
  currencyPair,
  rate,
  amount,
  lendingRate
});
```

- [`marginSell`](https://docs.poloniex.com/?shell#marginsell)

```typescript
const currencyPair = "BTC_ETH";
const rate = 10;
const amount = 1;
const lendingRate = 0.015;
const clientOrderId = 12345;
const order = await client.marginSell({
  currencyPair,
  rate,
  amount,
  lendingRate,
  clientOrderId
});
```

- [`getMarginPosition`](https://docs.poloniex.com/?shell#getmarginposition)

```typescript
const currencyPair = "BTC_ETH";
const position = await client.getMarginPosition({ currencyPair });
```

- [`closeMarginPosition`](https://docs.poloniex.com/?shell#closemarginposition)

```typescript
const currencyPair = "BTC_ETH";
const position = await client.closeMarginPosition({ currencyPair });
```

- [`createLoanOffer`](https://docs.poloniex.com/?shell#createloanoffer)

```typescript
const currency = "BTC";
const amount = 0.1;
const duration = 2;
const autoRenew = 0;
const lendingRate = 0.015;
const offer = await client.createLoanOffer({
  currency,
  amount,
  duration,
  autoRenew,
  lendingRate
});
```

- [`cancelLoanOffer`](https://docs.poloniex.com/?shell#cancelloanoffer)

```typescript
const orderNumber = 1002013188;
const offer = await client.cancelLoanOffer({ orderNumber });
```

- [`getOpenLoanOffers`](https://docs.poloniex.com/?shell#returnopenloanoffers)

```typescript
const offers = await client.getOpenLoanOffers();
```

- [`getActiveLoans`](https://docs.poloniex.com/#returnactiveloans)

```typescript
const loans = await client.getActiveLoans();
```

- [`getLendingHistory`](https://docs.poloniex.com/#returnlendinghistory)

```typescript
const start = 1483228800;
const end = 1483315200;
const limit = 100;
const history = await client.getLendingHistory({ start, end, limit });
```

- [`toggleAutoRenew`](https://docs.poloniex.com/#toggleautorenew)

```javascript
const orderNumber = 1002013188;
const result = await authClient.toggleAutoRenew({ orderNumber });
```

### WebsocketClient

```javascript
const key = "poloniexapikey";
const secret = "poloniexapisecret";
const channels = [1000, "BTC_DOGE"];
const { WebsocketClient } = require("poloniex-node-api");
const websocket = new WebsocketClient({ key, secret, channels });
websocket.on("open", () => {
  console.log("open");
});
websocket.on("close", () => {
  console.log("close");
});
websocket.on("error", error => {
  console.error(error);
});
websocket.on("message", message => {
  console.log(message);
});
```

- `connect`

```javascript
websocket.connect();
```

- `disconnect`

```javascript
websocket.disconnect();
```

- `subscribe`

```javascript
websocket.subscribe(1003);
```

- `unsubscribe`

```javascript
websocket.unsubscribe("BTC_ZEC");
```

### Test

```bash
npm test
```
