import { SocketStream } from '@fastify/websocket';
import { authenticate } from '@lib/utils/auth';
import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  deriveBip32Hardened,
  deriveBip32NonHardened,
} from 'src/service/mpc/ecdsa/derive-bip-32.service';
import {
  generateGenericSecret,
  importGenericSecret,
} from 'src/service/mpc/ecdsa/generic-secret.service';
import { websocketRoute } from '../lib/routes/websocket/websocket-handlers';
import { generateEcdsaKey } from '../service/mpc/ecdsa/generate-share.service';
import { signWithEcdsaShare } from '../service/mpc/ecdsa/signature.service';
import { websocketRouteWithInitParameter } from './../lib/routes/websocket/websocket-handlers';

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
      route + '/generateGenericSecret',
      { websocket: true },
      websocketRoute(generateGenericSecret)
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/importGenericSecret',
      { websocket: true },
      websocketRouteWithInitParameter(importGenericSecret)
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/derive/hardened',
      { websocket: true },
      websocketRouteWithInitParameter(deriveBip32Hardened)
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/derive/non-hardened',
      { websocket: true },
      websocketRouteWithInitParameter(deriveBip32NonHardened)
    );
  });

  server.register(async function (server) {
    server.get(route + '/generateEcdsa', { websocket: true }, websocketRoute(generateEcdsaKey));
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
