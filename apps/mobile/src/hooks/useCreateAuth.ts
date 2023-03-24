import { CreateUserResponse } from '@superlight/api/src/repository/user';
import { ResultAsync } from 'neverthrow';
import { AppUser } from 'state/auth.state';
import { AppError } from 'state/snackbar.state';
import { signWithDeviceKey } from 'util/auth';
import { backend } from 'util/superlight-api';
import { appError } from './../util/error/error';

export const useCreateAuth =
  () =>
  (devicePublicKey: string): ResultAsync<AppUser, AppError> => {
    return createUser(devicePublicKey)
      .andThen(createSignature)
      .andThen(verifyUser)
      .map(userId => ({ id: userId, devicePublicKey }));
  };

const createUser = (
  devicePublicKey: string
): ResultAsync<CreateUserResponse & { devicePublicKey: string }, AppError> =>
  ResultAsync.fromPromise(
    backend.post<CreateUserResponse>('/user/create', {
      devicePublicKey,
    }),
    error => appError(error, 'Error while creating user')
  ).map(axiosResponse => ({ ...axiosResponse.data, devicePublicKey }));

const createSignature = ({
  nonce,
  userId,
  devicePublicKey,
}: CreateUserResponse & { devicePublicKey: string }): ResultAsync<SignatureResult, AppError> => {
  return ResultAsync.fromPromise(signWithDeviceKey(nonce), error =>
    appError(error, 'Error while signing nonce with device key')
  ).map(signature => ({
    signature,
    userId,
    devicePublicKey,
  }));
};

type SignatureResult = {
  signature: string;
  userId: string;
  devicePublicKey: string;
};

const verifyUser = ({
  signature,
  userId,
  devicePublicKey,
}: SignatureResult): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(
    backend.post(
      '/user/verify',
      { signature, userId, devicePublicKey },
      { withCredentials: true, headers: { signature } }
    ),
    error => appError(error, 'Error verifying new user with device key')
  ).map(_ => userId);
};
