import { mpcContextRoute } from '@lib/routes/rest/rest-handlers';
import {
  DeriveFrom,
  ImportHexSchema,
  SignWithShare,
  deriveFromSchema,
  importHexSchema,
  signWithShareSchema,
} from '@superlight-labs/mpc-common';
import { FastifyInstance } from 'fastify';
import {
  deriveWithoutStepping,
  initDeriveProcess,
} from 'src/service/mpc/ecdsa/derive-bip-32.service';
import { initSignProcess } from 'src/service/mpc/ecdsa/signature.service';
import { StepRequest, handleStep, stepSchema } from 'src/service/mpc/ecdsa/step.service';
import {
  createGenerateEcdsaKey,
  createGenerateGenericSecretContext,
  createImportGenericSecretContext,
} from 'src/service/mpc/mpc-context.service';

export type ActionStatus = 'Init' | 'Stepping';

const route = '/mpc/ecdsa';

const registerMcpRoutes = (server: FastifyInstance) => {
  server.register(async function (server) {
    server.get(
      route + '/step',
      { schema: { body: stepSchema } },
      mpcContextRoute((req, user) => handleStep(req.body as StepRequest, user))
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/generate-generic-secret',
      mpcContextRoute((_, user) =>
        createGenerateGenericSecretContext().asyncMap(context => Promise.resolve({ context, user }))
      )
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/import-generic-secret',
      { schema: { body: importHexSchema } },
      mpcContextRoute((req, user) =>
        createImportGenericSecretContext(
          Buffer.from((req.body as ImportHexSchema).hexSeed, 'hex')
        ).asyncMap(context =>
          Promise.resolve({
            context,
            user,
          })
        )
      )
    );
  });

  // With Steps means that there are multiple steps necessary on client and server to create a keypair
  // Usually used for hardened key derivation. One exception is the derivation of the master key from the seed shared,
  // which is non-hardened, but via multiple steps
  server.register(async function (server) {
    server.get(
      route + '/derive/stepping',
      { schema: { body: deriveFromSchema } },
      mpcContextRoute((req, user) =>
        // TODO: we might need the rest of the result of initDerive, not just the context - in that case use your brain
        initDeriveProcess(req.body as DeriveFrom, user.id).map(({ context }) => ({ context, user }))
      )
    );
  });

  // Without steps means, that the key can be fetched from the mpc context immediately on the server.
  // Client side it is necessary to step once with `step(null)`
  server.register(async function (server) {
    server.get(
      route + '/derive/no-steps',
      { schema: { body: deriveFromSchema } },

      mpcContextRoute((req, user) =>
        initDeriveProcess(req.body as DeriveFrom, user.id).andThen(deriveContext =>
          deriveWithoutStepping(deriveContext, user)
        )
      )
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/generateEcdsa',
      mpcContextRoute((_, user) =>
        createGenerateEcdsaKey().asyncMap(context => Promise.resolve({ context, user }))
      )
    );
  });

  server.register(async function (server) {
    server.get(
      route + '/sign',
      {
        schema: {
          body: signWithShareSchema,
        },
      },
      mpcContextRoute((req, user) =>
        initSignProcess(req.body as SignWithShare, user.id).map(context => ({ context, user }))
      )
    );
  });
};

export default registerMcpRoutes;
