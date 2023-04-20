import * as bip39 from '@scure/bip39';
import { AppError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';

export const mnemonicToSeed = (mnemonic: string): ResultAsync<Uint8Array, AppError> => {
  // Wrapping this in a promise with empty to avoid blocking the UI
  const promise = new Promise<Uint8Array>((resolve, reject) => {
    setTimeout(() => {
      bip39.mnemonicToSeed(mnemonic).then(resolve).catch(reject);
    }, 0);
  });

  return ResultAsync.fromPromise(promise, err => ({
    level: 'error',
    message: 'Error while processing seed',
    error: err,
  }));
};
