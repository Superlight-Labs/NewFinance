import { CreateUserResponse } from '@superlight-labs/api/src/repository/user';
import { AppError, SignResult, appError } from '@superlight-labs/mpc-common';
import { AxiosError } from 'axios';
import { ResultAsync } from 'neverthrow';
import { AppUser } from 'state/auth.state';
import { SignUser, signWithDeviceKeyNoAuth } from 'utils/auth';
import { backend } from 'utils/superlight-api';

export const useCreateAuth =
  () =>
  (devicePublicKey: string, username: string, email: string): ResultAsync<AppUser, AppError> => {
    return createUser(devicePublicKey, username, email)
      .andThen(createSignature)
      .andThen(verifyUser)
      .map(userId => ({ id: userId, devicePublicKey, username, email }));
  };

const createUser = (
  devicePublicKey: string,
  username: string,
  email: string
): ResultAsync<SignUser & { nonce: string }, AppError> =>
  ResultAsync.fromPromise(
    backend.post<CreateUserResponse>('/user/create', {
      username,
      email,
      devicePublicKey,
    }),
    error => {
      let msg = 'Error while creating user';

      if (error instanceof AxiosError) {
        msg = error.response?.data?.error || error.message;
      }

      return appError(error, msg);
    }
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
