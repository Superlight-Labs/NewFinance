export const isNonceValid = (nonce: string | null) =>
  nonce && nonce.length === 24;
