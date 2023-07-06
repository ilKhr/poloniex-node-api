export interface SignRequestOptions {
  key: string;
  secret: string;
  body: string;
}
export interface SignedRequest {
  key: string;
  sign: string;
}
export declare function SignRequest({
  key,
  secret,
  body,
}: SignRequestOptions): SignedRequest;
