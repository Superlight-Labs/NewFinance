import { mpcInternalError } from '@superlight/mpc-common';
import * as RnMpc from '@superlight/rn-crypto-mpc';
import { ResultAsync } from 'neverthrow';

export const initGenerateGenericSecret = () => {
  return ResultAsync.fromPromise(RnMpc.initGenerateGenericSecret(), err => mpcInternalError(err));
};

export const step = (message: string | null) => {
  return ResultAsync.fromPromise(RnMpc.step(message), err => mpcInternalError(err));
};
