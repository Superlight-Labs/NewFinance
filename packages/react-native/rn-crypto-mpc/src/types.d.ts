export type MPCError = {
  type: 'error';
  error: number;
};

export type MPCSuccess = {
  type: 'success';
};

export type StepResult = { type: 'error'; error?: unknown } | SuccessfulStep | InProgressStep;

export type SuccessfulStep = {
  type: 'success';
  keyShare: string;
  context: string;
  message: number[];
};

export type InProgressStep = {
  message: number[];
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
