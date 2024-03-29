import {
  DeriveFrom,
  SignWithShare,
  appError,
  indexToNumber,
  mpcInternalError,
} from '@superlight-labs/mpc-common';
import * as RnMpc from '@superlight-labs/rn-crypto-mpc';
import { ResultAsync } from 'neverthrow';

export const initGenerateGenericSecret = () => {
  return ResultAsync.fromPromise(RnMpc.initGenerateGenericSecret(), err => mpcInternalError(err));
};

export const initImportGenericSecret = (hexSecret: string) => {
  return ResultAsync.fromPromise(RnMpc.initImportGenericSecret(hexSecret), err =>
    mpcInternalError(err)
  );
};

export type InitDeriveFrom = DeriveFrom & { share: string };

export const initDeriveBip32 = (deriveFrom: InitDeriveFrom, hardened: boolean) => {
  return ResultAsync.fromPromise(
    RnMpc.initDeriveBIP32(deriveFrom.share, indexToNumber(deriveFrom.index), hardened),
    err => mpcInternalError(err, 'Error while creating derive context')
  );
};

export type InitSign = SignWithShare & { share: string };

export const initSignEcdsa = (signConfig: InitSign) => {
  const { share, messageToSign, encoding } = signConfig;

  return ResultAsync.fromPromise(
    RnMpc.initSignEcdsa(Buffer.from(messageToSign, encoding), share),
    err => mpcInternalError(err, 'Error while preparing Signature')
  );
};

export const getXPubKey = (share: string, network: 'main' | 'test' = 'main') => {
  return ResultAsync.fromPromise(RnMpc.getXPubKey(share, network), err =>
    appError(err, 'Error while getting xPub key')
  );
};

export const getPublicKey = (share: string) => {
  return ResultAsync.fromPromise(RnMpc.getPublicKey(share), err =>
    appError(err, 'Error while getting public key')
  );
};

export const step = (message: string | null) => {
  return ResultAsync.fromPromise(RnMpc.step(message), err => mpcInternalError(err));
};

export const getResultDeriveBIP32 = (context: string) => {
  return ResultAsync.fromPromise(RnMpc.getResultDeriveBIP32(context), err => mpcInternalError(err));
};

export const getResultSignEcdsa = (context: string) => {
  return ResultAsync.fromPromise(RnMpc.getDerSignature(context), err => mpcInternalError(err));
};
