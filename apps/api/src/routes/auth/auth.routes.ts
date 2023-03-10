import { setNonceRoute } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';
import { CreateNonceResponse } from './auth';

const getNonce = setNonceRoute<CreateNonceResponse>((req: FastifyRequest, nonce: string) =>
  ResultAsync.fromSafePromise(Promise.resolve({ nonce }))
);

const registerAuthRoutes = (server: FastifyInstance) => {
  server.get('/auth/get-nonce', getNonce);
};

export default registerAuthRoutes;
