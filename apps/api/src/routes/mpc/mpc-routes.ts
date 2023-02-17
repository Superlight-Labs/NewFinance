import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { authenticate } from "@lib/utils/auth";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Server } from "../../server";
import { User } from "../user/user";
import { deriveBIP32 } from "./ecdsa/derive/deriveBIP32";
import { generateEcdsaKey } from "./ecdsa/generateEcdsa";
import { generateGenericSecret } from "./ecdsa/generateSecret";
import { importGenericSecret } from "./ecdsa/importSecret";
import { signWithEcdsaShare } from "./ecdsa/sign";

export type ActionStatus = "Init" | "Stepping";

const route = "/mpc/ecdsa";

const registerMcpRoutes = (server: Server): void => {
  // Routes that need Authentication
  server.register(async function plugin(privatePlugin, opts) {
    privatePlugin.addHook("onRequest", async (req) => {
      const userResult = await authenticate(req);

      if (userResult.isErr()) throw userResult.error;

      req["user"] = userResult.value;
    });

    registerPrivateMpcRoutes(privatePlugin);
  });
};

const registerPrivateMpcRoutes = (server: FastifyInstance) => {
  server.register(async function (server) {
    server.get(
      route + "/generateSecret",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const user: User = req["user"];
        generateGenericSecret(connection, user);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + "/import",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const user: User = req["user"];
        importGenericSecret(connection, user);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + "/derive",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const usage = server.memoryUsage();
        logger.info(
          {
            ...usage,
            heapUsed: usage.heapUsed / 1000000 + " MB",
            rssBytes: usage.rssBytes / 1000000 + " MB",
          },
          "Starting Bip Derive - Monitoring Memory usage"
        );
        const user: User = req["user"];
        deriveBIP32(connection, user);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + "/generateEcdsa",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const user: User = req["user"];
        generateEcdsaKey(connection, user);
      }
    );
  });

  server.register(async function (server) {
    server.get(
      route + "/sign",
      { websocket: true },
      (connection: SocketStream, req: FastifyRequest) => {
        const user: User = req["user"];
        signWithEcdsaShare(connection, user);
      }
    );
  });
};

export default registerMcpRoutes;
