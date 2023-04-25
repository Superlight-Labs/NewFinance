import { nonceRoute, setNonceRoute } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { createNewUser, verifyUser } from 'src/service/data/user.service';
import { CreateUserRequest, CreateUserResponse, VerifyUserRequest } from '../repository/user';

export const registerUserRoutes = (server: FastifyInstance) => {
  server.post('/user/create', { schema: createUserSchema }, postCreateUser);
  server.post('/user/verify', { schema: verifyUserSchema }, postVerifyUser);
};

const postCreateUser = setNonceRoute<CreateUserResponse>((req: FastifyRequest, nonce: string) => {
  return createNewUser(req.body as CreateUserRequest, nonce);
});

const postVerifyUser = nonceRoute<boolean>((req: FastifyRequest, nonce: string) => {
  return verifyUser(req.body as VerifyUserRequest, nonce);
});

const createUserSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['devicePublicKey'],
    properties: {
      devicePublicKey: { type: 'string', maxLength: 130, minLength: 88 },
    },
  },
};

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
