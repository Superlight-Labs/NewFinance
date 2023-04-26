import { Static, Type } from '@fastify/type-provider-typebox';
import { nonceRoute, setNonceRoute } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
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

export type CreateUserRequest = Static<typeof createUserSchema>;
export const registerUserRoutes = (server: FastifyInstance) => {
  server.post('/user/create', { schema: { body: createUserSchema } }, postCreateUser);
  server.post('/user/verify', { schema: verifyUserSchema }, postVerifyUser);
};

const postCreateUser = setNonceRoute<CreateUserResponse>((req: FastifyRequest, nonce: string) => {
  return createNewUser(req.body as CreateUserRequest, nonce);
});

const postVerifyUser = nonceRoute<boolean>((req: FastifyRequest, nonce: string) => {
  return verifyUser(req.body as VerifyUserRequest, nonce);
});
