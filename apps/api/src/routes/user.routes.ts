import { Static, Type } from '@fastify/type-provider-typebox';
import { other } from '@lib/routes/rest/rest-error';
import { nonceRoute, route, setNonceRoute } from '@lib/routes/rest/rest-handlers';
import { getSafeResultAsync } from '@lib/utils/neverthrow';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { isUsernameOrEmailTaken } from 'src/repository/user.repository';
import { createNewUser, verifyUser } from 'src/service/data/user.service';
import { CreateUserResponse, VerifyUserRequest } from '../repository/user';

const createUserSchema = Type.Object({
  devicePublicKey: Type.String({ maxLength: 130, minLength: 88 }),
  username: Type.String({ maxLength: 36, minLength: 3 }),
  email: Type.String({ maxLength: 36, minLength: 3, format: 'email' }),
});

const verifyUserSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['devicePublicKey', 'userId', 'signature'],
    properties: {
      devicePublicKey: { type: 'string', maxLength: 130, minLength: 88 },
      userId: { type: 'string', maxLength: 36, minLength: 36 },
      signature: { type: 'string', maxLength: 96, minLength: 96 },
    },
  },
};

const isUsernameOrEmailTakenSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['usernameOrEmail'],
    properties: {
      usernameOrEmail: { type: 'string', maxLength: 64, minLength: 3 },
    },
  },
};

export type CreateUserRequest = Static<typeof createUserSchema>;
export const registerUserRoutes = (server: FastifyInstance) => {
  server.post('/user/create', { schema: { body: createUserSchema } }, postCreateUser);
  server.post('/user/verify', { schema: verifyUserSchema }, postVerifyUser);
  server.get(
    '/user/istaken/:usernameOrEmail',
    { schema: isUsernameOrEmailTakenSchema },
    getIsUsernameOrEmailTaken
  );
};

const postCreateUser = setNonceRoute<CreateUserResponse>((req: FastifyRequest, nonce: string) => {
  return createNewUser(req.body as CreateUserRequest, nonce);
});

const postVerifyUser = nonceRoute<boolean>((req: FastifyRequest, nonce: string) => {
  return verifyUser(req.body as VerifyUserRequest, nonce);
});

const getIsUsernameOrEmailTaken = route<boolean>((req: FastifyRequest) => {
  const params = req.params as any;

  const isUsernameTakenResult = getSafeResultAsync(
    isUsernameOrEmailTaken(params.usernameOrEmail),
    e => other('Error while reading Username/Email from DB', e)
  );
  return isUsernameTakenResult;
});
