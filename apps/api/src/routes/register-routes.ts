import { FastifyInstance } from 'fastify';
import registerAuthRoutes from './auth/auth.routes';
import { registerBlockchainRoutes } from './blockchain.routes';
import { registerContactRoutes } from './contact.routes';
import registerMcpRoutes from './mpc.routes';
import { registerTransactionRoutes } from './transaction.routes';
import { registerUserRoutes } from './user.routes';

export const registerRoutes = (server: FastifyInstance): void => {
  server.get('/health', (_, res) => {
    res.send({ status: 'ok' });
  });

  registerUserRoutes(server);
  registerMcpRoutes(server);
  registerAuthRoutes(server);
  registerContactRoutes(server);
  registerTransactionRoutes(server);
  registerBlockchainRoutes(server);
};
