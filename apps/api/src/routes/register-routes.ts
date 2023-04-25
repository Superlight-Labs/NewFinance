import { FastifyInstance } from 'fastify';
import registerAuthRoutes from './auth/auth.routes';
import { registerContactRoutes } from './contact.routes';
import registerMcpRoutes from './mpc.routes';
import { registerUserRoutes } from './user.routes';

export const registerRoutes = (server: FastifyInstance): void => {
  registerUserRoutes(server);
  registerMcpRoutes(server);
  registerAuthRoutes(server);
  registerContactRoutes(server);
};
