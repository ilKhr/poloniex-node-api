"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const index_js_1 = require("../index.js");
suite("signature", () => {
  test("correct headers", () => {
    const key = "poloniex-api-key";
    const signTimestamp = "1674197467415";
    const expected = {
      key,
      signTimestamp,
      signature: "rCahSwbMNIzxQRUSqzxdMvYP9CDWfRUDNIFDVABxHQQ=",
      signatureMethod: index_js_1.signatureMethod,
      signatureVersion: `${index_js_1.signatureVersion}`,
    };
    const searchParams = new URLSearchParams({
      requestBody: JSON.stringify({ a: 1, b: ["2", null] }),
      signTimestamp,
    });
    const actual = (0, index_js_1.signature)({
      key,
      secret: "poloniex-api-secret",
      signTimestamp,
      path: "/some/path",
      method: "DELETE",
      searchParams,
    });
    (0, node_assert_1.deepStrictEqual)(actual, expected);
  });
});
