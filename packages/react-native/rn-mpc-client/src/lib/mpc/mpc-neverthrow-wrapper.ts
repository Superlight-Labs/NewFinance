import {
  WebsocketError,
  appError,
  indexToNumber,
  mpcInternalError,
} from '@superlight-labs/mpc-common';
import * as RnMpc from '@superlight-labs/rn-crypto-mpc';
import { StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
import { ResultAsync } from 'neverthrow';
import { DeriveFrom, SignWithShare } from './mpc-types';

export const initGenerateGenericSecret = () => {
  return ResultAsync.fromPromise(RnMpc.initGenerateGenericSecret(), err => mpcInternalError(err));
};

export const initImportGenericSecret = (hexSecret: string) => {
  return ResultAsync.fromPromise(RnMpc.initImportGenericSecret(hexSecret), err =>
    mpcInternalError(err)
  );
};

export const initDeriveBip32 = (deriveFrom: DeriveFrom, hardened: boolean) => {
  return ResultAsync.fromPromise(
    RnMpc.initDeriveBIP32(deriveFrom.share, indexToNumber(deriveFrom.index), hardened),
    err => mpcInternalError(err, 'Error while creating derive context')
  );
};

export const initSignEcdsa = (signConfig: SignWithShare) => {
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

export const step = (message: string | null): ResultAsync<StepResult, WebsocketError> => {
  const result = ResultAsync.fromPromise(RnMpc.step(message), err => mpcInternalError(err));

  return result.map(stepOut => {
    if (stepOut.type !== 'inProgress') return stepOut;

    // if (stepOut.message.length > 10000000) {
    //   return {
    //     type: 'inProgress',
    //     message: encode(stepOut.message) as Uint8Array,
    //     compressed: true,
    //   };
    // }
    return {
      type: 'inProgress',
      message: stepOut.message as string,
      compressed: false,
    };
  });
};
