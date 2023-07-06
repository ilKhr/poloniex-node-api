export type ISignatureMethod = "HmacSHA256";
export declare const signatureMethod: ISignatureMethod;
export declare const signatureVersion = 1;
export interface ISignatureOptions {
  method: string;
  searchParams: URLSearchParams;
  key: string;
  secret: string;
  signTimestamp: number | string;
  path: string;
}
export interface ISignedHeaders {
  key: string;
  signature: string;
  signTimestamp: string;
  signatureMethod: string;
  signatureVersion: string;
}
export declare function signature({
  key,
  secret,
  signTimestamp,
  path,
  method,
  searchParams,
}: ISignatureOptions): ISignedHeaders;
