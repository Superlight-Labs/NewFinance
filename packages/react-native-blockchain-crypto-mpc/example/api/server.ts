import websocketPlugin from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import logger from './lib/logger';
import { registerRoutes } from './routes/register-routes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fastify = require('fastify');

const server: FastifyInstance = fastify();

// eslint-disable-next-line @typescript-eslint/no-var-requires
server.register(websocketPlugin);

registerRoutes(server);

server.all('*', (request, reply) => {
  reply.status(404).send({ error: 'Route does not exist' });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  logger.info(`Server listening at ${address}`);
});

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaugh Exception');
  logger.warn('Shutting down server because of uncaught exception');

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ err: reason, promise }, 'Unhandled Promise Rejection');
  process.exit(1);
});
