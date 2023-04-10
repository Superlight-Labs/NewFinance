import { mpcInternalError } from '@superlight/mpc-common';
import * as RnMpc from '@superlight/rn-crypto-mpc';
import { ResultAsync } from 'neverthrow';
import { DeriveFrom } from './mpc-types';

export const initGenerateGenericSecret = () => {
  return ResultAsync.fromPromise(RnMpc.initGenerateGenericSecret(), err => mpcInternalError(err));
};

export const initImportGenericSecret = (hexSecret: string) => {
  return ResultAsync.fromPromise(RnMpc.initImportGenericSecret(hexSecret), err =>
    mpcInternalError(err)
  );
};

export const initDeriveBip32 = (deriveFrom: DeriveFrom) => {
  return ResultAsync.fromPromise(
    RnMpc.initDeriveBIP32(deriveFrom.share, deriveFrom.index, deriveFrom.hardened),
    err => mpcInternalError(err)
  );
};

export const step = (message: string | null) => {
  return ResultAsync.fromPromise(RnMpc.step(message), err => mpcInternalError(err));
};
