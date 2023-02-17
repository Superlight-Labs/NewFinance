import fastifyCookie from "@fastify/cookie";
import underPressure, {
  TYPE_HEAP_USED_BYTES,
  TYPE_RSS_BYTES
} from "@fastify/under-pressure";
import websocketPlugin from "@fastify/websocket";
import config from "@lib/config";
import { PrismaClient } from "@prisma/client";
import logger from "./lib/logger";
import { registerRoutes } from "./routes/register-routes";

import fastify from "fastify";

const server = fastify({ logger });

export type Server = typeof server;

logger.info({ config }, "Started up server with config");

// eslint-disable-next-line @typescript-eslint/no-var-requires
server.register(websocketPlugin);
server.register(fastifyCookie, {
  secret: config.cookieSecret,
});

server.register(underPressure, {
  maxHeapUsedBytes: 500 * 1000000,
  // maxRssBytes: 500 * 1000000,
  retryAfter: 10000,
  pressureHandler: (req, rep, type, value) => {
    if (type === TYPE_HEAP_USED_BYTES) {
      logger.warn({ bytes: value }, "too many heap bytes used");
    } else if (type === TYPE_RSS_BYTES) {
      logger.warn({ bytes: value }, "too many rss bytes used");
    }

    rep.status(500).send("Server out of memory try again later!");
  },
});

export const client: PrismaClient = new PrismaClient({
  datasources: { db: { url: config.databaseUrl } },
});

registerRoutes(server);

server.all("*", (request, reply) => {
  reply.status(404).send({ error: "Route does not exist" });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    logger.error({ err, address }, "Error while trying to listen on port 8080");
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaugh Exception");
  logger.warn("Shutting down server because of uncaught exception");

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    {
      error: reason,
    },
    "Unhandled Promise Rejection"
  );

  // need to log the promise without stringifying it to properly
  // display all rejection info
  logger.warn({ promise });

  // TODO: stream errors to sentry

  process.exit(1);
});
