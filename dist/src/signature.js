"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signature = exports.signatureVersion = exports.signatureMethod = void 0;
const node_crypto_1 = require("node:crypto");
exports.signatureMethod = "HmacSHA256";
exports.signatureVersion = 1;
function signature({ key, secret, signTimestamp, path, method, searchParams }) {
  const data = decodeURIComponent(searchParams.toString());
  return {
    key,
    signature: (0, node_crypto_1.createHmac)("sha256", secret)
      .update(`${method}\n${path}\n${data}`)
      .digest("base64"),
    signTimestamp: `${signTimestamp}`,
    signatureMethod: exports.signatureMethod,
    signatureVersion: `${exports.signatureVersion}`,
  };
}
exports.signature = signature;
