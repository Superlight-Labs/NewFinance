import { setNonceRoute } from "@lib/route/handlers";
import { Server } from "@server";
import { FastifyRequest } from "fastify";
import { ResultAsync } from "neverthrow";
import { CreateNonceResponse } from "./auth";

const getNonce = setNonceRoute<CreateNonceResponse>(
  (req: FastifyRequest, nonce: string) =>
    ResultAsync.fromSafePromise(Promise.resolve({ nonce }))
);

const registerAuthRoutes = (server: Server) => {
  server.get("/auth/get-nonce", getNonce);
};

export default registerAuthRoutes;
