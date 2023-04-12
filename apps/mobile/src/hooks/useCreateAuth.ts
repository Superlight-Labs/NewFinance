import { CreateUserResponse } from '@superlight-labs/api/src/repository/user';
import { SignResult } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { AppUser } from 'state/auth.state';
import { AppError } from 'state/snackbar.state';
import { SignUser, signWithDeviceKeyNoAuth } from 'util/auth';
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

const createUser = (devicePublicKey: string): ResultAsync<SignUser & { nonce: string }, AppError> =>
  ResultAsync.fromPromise(
    backend.post<CreateUserResponse>('/user/create', {
      devicePublicKey,
    }),
    error => appError(error, 'Error while creating user')
  ).map(axiosResponse => ({ ...axiosResponse.data, devicePublicKey }));

const createSignature = (user: SignUser & { nonce: string }): ResultAsync<SignResult, AppError> => {
  return signWithDeviceKeyNoAuth(user)(user.nonce);
};

const verifyUser = ({
  signature,
  userId,
  devicePublicKey,
}: SignResult): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(
    backend.post(
      '/user/verify',
      { signature, userId, devicePublicKey },
      { withCredentials: true, headers: { signature } }
    ),
    error => appError(error, 'Error verifying new user with device key')
  ).map(_ => userId);
};
