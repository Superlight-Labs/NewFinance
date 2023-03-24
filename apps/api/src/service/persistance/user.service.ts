import { other, RouteError } from '@lib/routes/rest/rest-error';
import { buildPubKey } from '@lib/utils/auth';
import { getSafeResultAsync } from '@lib/utils/neverthrow';
import crypto from 'crypto';
import { okAsync, ResultAsync } from 'neverthrow';
import { MpcKeyShare } from 'src/repository/key-share';
import { createUser, readUser, readUserKeyShareByPath } from 'src/repository/user.repository';
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserWalletByPathRequest,
  User,
  VerifyUserRequest,
} from '../../repository/user';
import { updateKeyShare } from './key-share.service';

export const createNewUser = (
  request: CreateUserRequest,
  nonce: string
): ResultAsync<CreateUserResponse, RouteError> => {
  return ResultAsync.fromPromise(createUser(request), e =>
    other('Err while creating user', e as Error)
  ).map(user => {
    return {
      nonce,
      userId: user.id,
    };
  });
};

export const verifyUser = (
  request: VerifyUserRequest,
  message: string
): ResultAsync<boolean, RouteError> => {
  const { signature } = request;

  const readUserResult = getSafeResultAsync(readUser(request), e =>
    other('Error while reading User from DB', e)
  );

  return readUserResult.andThen(user => {
    const verifier = crypto.createVerify('SHA256').update(message, 'utf-8');
    const result = verifier.verify(
      {
        key: buildPubKey(user.devicePublicKey),
        format: 'pem',
        type: 'pkcs1',
      },
      Buffer.from(signature, 'base64')
    );
    return okAsync(result);
  });
};

export const updateUserWalletAddress = (
  user: User,
  request: UpdateUserWalletByPathRequest
): ResultAsync<MpcKeyShare, RouteError> => {
  const { path, address } = request;
  const readKeyShare = getSafeResultAsync(readUserKeyShareByPath(user, path), e =>
    other('Error while reading Key Share for user', e)
  );

  return readKeyShare.andThen(keyShare => updateKeyShare(keyShare, address));
};
