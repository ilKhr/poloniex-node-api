"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignRequest = void 0;
const node_crypto_1 = require("node:crypto");
function SignRequest({ key, secret, body }) {
  return {
    key,
    sign: (0, node_crypto_1.createHmac)("sha512", secret)
      .update(body)
      .digest("hex"),
  };
}
exports.SignRequest = SignRequest;
