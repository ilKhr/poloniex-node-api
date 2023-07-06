"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = require("node:assert");
const index_js_1 = require("../../src/legacy/index.js");
suite("SignRequest", () => {
  test("correct signature", () => {
    const key = "my-key";
    const secret = "my-secret";
    const form = new URLSearchParams({
      command: "returnBalances",
      nonce: "154264078495300",
    });
    const sign =
      "eed2186d51a9e23aae6b60ba41f76ca3b4c5a2cb620e6f52c351c804660887e28b1a7c9f9a01e2daf77f8103bcd966e1f501de2d062eefb3213da2f47ac06cdc";
    const actual = (0, index_js_1.SignRequest)({
      key,
      secret,
      body: form.toString(),
    });
    (0, node_assert_1.deepStrictEqual)(actual, { sign, key });
  });
});
