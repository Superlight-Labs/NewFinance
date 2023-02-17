import { FastifyInstance } from 'fastify';
import registerMcpRoutes from './mpc/mpc-routes';

export const registerRoutes = (server: FastifyInstance): void => {
  registerMcpRoutes(server);
};
