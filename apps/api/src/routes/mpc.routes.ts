import { authenticate } from '@lib/utils/auth';
import { DeriveConfig, SignConfig } from '@superlight-labs/mpc-common';
import { FastifyInstance } from 'fastify';
import {
  deriveBip32WithSteps,
  deriveBip32WithoutStepping,
} from 'src/service/mpc/ecdsa/derive-bip-32.service';
import {
  generateGenericSecret,
  importGenericSecret,
} from 'src/service/mpc/ecdsa/generic-secret.service';
import { signWithEcdsaKey } from 'src/service/mpc/ecdsa/signature.service';
import { websocketRoute } from '../lib/routes/websocket/websocket-handlers';
import { generateEcdsaKey } from '../service/mpc/ecdsa/generate-share.service';
import { websocketRouteWithInitParameter } from './../lib/routes/websocket/websocket-handlers';

export type ActionStatus = 'Init' | 'Stepping';

const route = '/mpc/ecdsa';

const registerMcpRoutes = (server: FastifyInstance): void => {
  server.register(async function plugin(privatePlugin, opts) {
    privatePlugin.addHook('onRequest', async req => {
      const userResult = await authenticate(req);

      // TODO this error is actually not picked up by client
      if (userResult.isErr()) throw userResult.error;

      req.user = userResult.value;
    });

    registerPrivateMpcRoutes(privatePlugin);
  });
};

const registerPrivateMpcRoutes = (server: FastifyInstance) => {
  server.register(async function (server) {
    server.get(
      route + '/generate-generic-secret',
      { websocket: true },
      websocketRoute(generateGenericSecret)
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/import-generic-secret',
      { websocket: true },
      websocketRouteWithInitParameter(importGenericSecret)
    );
  });

  // With Steps means that there are multiple steps necessary on client and server to create a keypair
  // Usually used for hardened key derivation. One exception is the derivation of the master key from the seed shared,
  // which is non-hardened, but via multiple steps
  server.register(async function (server) {
    server.get(
      route + '/derive/stepping',
      { websocket: true },
      websocketRouteWithInitParameter<string, DeriveConfig>(deriveBip32WithSteps)
    );
  });

  // Without steps means, that the key can be fetched from the mpc context immediately on the server.
  // Client side it is necessary to step once with `step(null)`
  server.register(async function (server) {
    server.get(
      route + '/derive/no-steps',
      { websocket: true },
      websocketRouteWithInitParameter<string, DeriveConfig>(deriveBip32WithoutStepping)
    );
  });

  server.register(async function (server) {
    server.get(route + '/generateEcdsa', { websocket: true }, websocketRoute(generateEcdsaKey));
  });

  server.register(async function (server) {
    server.get(
      route + '/sign',
      { websocket: true },
      websocketRouteWithInitParameter<void, SignConfig>(signWithEcdsaKey)
    );
  });
};

export default registerMcpRoutes;
