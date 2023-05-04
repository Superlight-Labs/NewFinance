import { other, RouteError } from '@lib/routes/rest/rest-error';
import { buildPubKey } from '@lib/utils/auth';
import { getSafeResultAsync } from '@lib/utils/neverthrow';
import { createVerify } from 'crypto';
import { okAsync, ResultAsync } from 'neverthrow';
import { createUser, readUser } from 'src/repository/user.repository';
import { CreateUserRequest } from 'src/routes/user.routes';
import { CreateUserResponse, VerifyUserRequest } from '../../repository/user';

export const createNewUser = (
  request: CreateUserRequest,
  nonce: string
): ResultAsync<CreateUserResponse, RouteError> => {
  return ResultAsync.fromPromise(createUser(request), e => other('Err while creating user', e)).map(
    user => {
      return {
        nonce,
        userId: user.id,
      };
    }
  );
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
    const verifier = createVerify('SHA256').update(message, 'utf-8');
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
