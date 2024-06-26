import fastifyCookie from '@fastify/cookie';
import underPressure, { TYPE_HEAP_USED_BYTES, TYPE_RSS_BYTES } from '@fastify/under-pressure';
import websocketPlugin from '@fastify/websocket';
import config from '@lib/config';
import logger from '@superlight-labs/logger';
import { registerRoutes } from './routes/register-routes';

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@superlight-labs/database';
import fastify from 'fastify';
import type { User } from './repository/user';

declare module 'fastify' {
  interface FastifyRequest {
    user: User | undefined;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const createServer = async (client: PrismaClient) => {
  const server = fastify({ logger, bodyLimit: 300e6 }).withTypeProvider<TypeBoxTypeProvider>();

  logger.info({ config }, 'Started up server with config');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  server.register(websocketPlugin, {
    options: { perMessageDeflate: true, maxPayload: 100 * 1024 * 1024, clientTracking: true },
  });
  server.register(fastifyCookie, {
    secret: config.cookieSecret,
  });

  server.register(underPressure, {
    maxHeapUsedBytes: 1024 * 1024 * 1024,
    // maxRssBytes: 500 * 1000000,
    retryAfter: 10000,
    pressureHandler: (req, rep, type, value) => {
      if (type === TYPE_HEAP_USED_BYTES) {
        logger.warn({ bytes: value }, 'too many heap bytes used');
      } else if (type === TYPE_RSS_BYTES) {
        logger.warn({ bytes: value }, 'too many rss bytes used');
      }

      rep.status(500).send('Server out of memory try again later!');
    },
  });

  registerRoutes(server as any);

  server.all('*', (request, reply) => {
    reply.status(404).send({ error: 'Route does not exist' });
  });

  await client.$connect();

  server.decorate('prisma', client);

  server.addHook('onClose', async server => {
    await server.prisma.$disconnect();
  });

  return server;
};
