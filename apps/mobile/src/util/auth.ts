import { SignResult } from '@superlight/mpc-common';
import { Signer } from '@superlight/rn-mpc-client';
import { generateKeyPair, sign } from '@superlight/rn-secure-encryption-module';
import * as LocalAuthentication from 'expo-local-authentication';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppError } from 'state/snackbar.state';
import { constants } from 'util/constants';
import { appError } from './error/error';

export const createDeviceKey = (): ResultAsync<string, AppError> => {
  return authenticate().andThen(_ =>
    ResultAsync.fromPromise(generateKeyPair(constants.deviceKeyName), err =>
      appError(err, 'Error while Generating Device Key')
    )
  );
};

export type SignUser = { devicePublicKey: string; userId: string };

export const signWithDeviceKey =
  ({ userId, devicePublicKey }: SignUser): Signer =>
  (message: string): ResultAsync<SignResult, AppError> => {
    return authenticate()
      .andThen(_ => signSafely(message))
      .map(signature => ({ signature, userId, devicePublicKey }));
  };

export const signWithDeviceKeyNoAuth =
  ({ userId, devicePublicKey }: SignUser): Signer =>
  (message: string): ResultAsync<SignResult, AppError> => {
    return signSafely(message).map(signature => ({
      signature,
      userId,
      devicePublicKey,
    }));
  };

const signSafely = (message: string) =>
  ResultAsync.fromPromise(sign(message, constants.deviceKeyName), err =>
    appError(err, 'Error while Signing with Device Key')
  );

const authenticate = () =>
  ResultAsync.fromPromise(
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to proceed',
      cancelLabel: 'cancel',
    }),
    err => appError(err, 'Error while Authenticating with Biometrics')
  ).andThen(result => {
    if (!result.success) {
      // Show snackbar here or similar
      return errAsync(appError(result.error, 'Error while Authenticating with Biometrics'));
    }

    return okAsync(result.success);
  });
