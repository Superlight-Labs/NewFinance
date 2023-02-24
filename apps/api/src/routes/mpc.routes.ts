import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import { authenticate } from '@lib/utils/auth';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { generateGenericSecret } from 'src/service/mpc/ecdsa/generic-secret.service';
import { websocketRoute } from '../lib/routes/websocket/websocket-handlers';
import { deriveBIP32 } from '../service/mpc/ecdsa/derive/deriveBIP32';
import { generateEcdsaKey } from '../service/mpc/ecdsa/generateEcdsa';
import { importGenericSecret } from '../service/mpc/ecdsa/importSecret';
import { signWithEcdsaShare } from '../service/mpc/ecdsa/sign';

export type ActionStatus = 'Init' | 'Stepping';

const route = '/mpc/ecdsa';

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.register(async function plugin(privatePlugin, opts) {
    privatePlugin.addHook('onRequest', async req => {
      const userResult = await authenticate(req);

      if (userResult.isErr()) throw userResult.error;

      req.user = userResult.value;
    });

    registerPrivateMpcRoutes(privatePlugin);
  });
};

const registerPrivateMpcRoutes = (server: FastifyInstance) => {
  server.register(async function (server) {
    server.get(
      route + '/generateSecret',
      { websocket: true },
      websocketRoute(generateGenericSecret)
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/import',
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        importGenericSecret(connection, req.user!);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/derive',
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const usage = server.memoryUsage();
        logger.info(
          {
            ...usage,
            heapUsed: usage.heapUsed / 1000000 + ' MB',
            rssBytes: usage.rssBytes / 1000000 + ' MB',
          },
          'Starting Bip Derive - Monitoring Memory usage'
        );
        deriveBIP32(connection, req.user!);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/generateEcdsa',
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        generateEcdsaKey(connection, req.user!);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/sign',
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        signWithEcdsaShare(connection, req.user!);
      }
    );
  });
};

export default registerMcpRoutes;
