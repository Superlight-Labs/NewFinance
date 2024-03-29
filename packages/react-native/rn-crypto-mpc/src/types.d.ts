export type MPCError = {
  type: 'error';
  error: number;
};

export type MPCSuccess = {
  type: 'success';
};

export type StepResult =
  | { type: 'error'; error?: unknown }
  | {
      type: 'success';
      keyShare: string;
      context: string;
      message: string;
    }
  | {
      message: string;
      type: 'inProgress';
    };

export type PublicKeyResult = MPCSuccess & {
  publicKey: string;
};

export type KeyShareResult = MPCSuccess & {
  keyShare: string;
};

export type XPubKeyResult = MPCSuccess & {
  xPubKey: string;
};

export type SignatureResult = MPCSuccess & {
  signature: string;
};
