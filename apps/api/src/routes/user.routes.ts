import { authenticatedRoute, nonceRoute, setNonceRoute } from '@lib/route/handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { createUser, updateUserWalletAddress, verifyUser } from 'src/service/user.service';
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserWalletByPathRequest,
  User,
  VerifyUserRequest,
} from '../repository/user';

export const registerUserRoutes = (server: FastifyInstance) => {
  server.post('/user/create', { schema: createUserSchema }, postCreateUser);
  server.post('/user/verify', { schema: verifyUserSchema }, postVerifyUser);
  server.post('/user/update-address', updateUserAddress);
};

const postCreateUser = setNonceRoute<CreateUserResponse>((req: FastifyRequest, nonce: string) => {
  return createUser(req.body as CreateUserRequest, nonce);
});

const postVerifyUser = nonceRoute<boolean>((req: FastifyRequest, nonce: string) => {
  return verifyUser(req.body as VerifyUserRequest, nonce);
});

const updateUserAddress = authenticatedRoute<any>((req: FastifyRequest, user: User) =>
  updateUserWalletAddress(user, req.body as UpdateUserWalletByPathRequest)
);

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
    required: ['devicePublicKey', 'userId', 'deviceSignature'],
    properties: {
      devicePublicKey: { type: 'string', maxLength: 130, minLength: 88 },
      userId: { type: 'string', maxLength: 36, minLength: 36 },
      deviceSignature: { type: 'string', maxLength: 96, minLength: 96 },
    },
  },
};
