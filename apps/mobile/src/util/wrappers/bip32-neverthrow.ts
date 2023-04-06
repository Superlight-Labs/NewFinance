import * as bip39 from '@scure/bip39';
import { ResultAsync } from 'neverthrow';
import { AppError } from 'state/snackbar.state';

export const mnemonicToSeed = (mnemonic: string): ResultAsync<Uint8Array, AppError> =>
  ResultAsync.fromPromise(bip39.mnemonicToSeed(mnemonic), err => ({
    level: 'error',
    message: 'Error while processing seed',
    error: err,
  }));
