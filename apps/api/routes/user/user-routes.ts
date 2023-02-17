import { authenticatedRoute, nonceRoute, setNonceRoute } from "@lib/route/handlers";
import { Server } from "@server";
import { FastifyRequest, FastifySchema } from "fastify";
import { CreateUserRequest, CreateUserResponse, UpdateUserWalletByPathRequest, User, VerifyUserRequest } from "./user";
import { createUser, updateUserWalletAddress, verifyUser } from "./user.service";

const postCreateUser = setNonceRoute<CreateUserResponse>((req: FastifyRequest, nonce: string) => {
  return createUser(req.body as CreateUserRequest, nonce);
});

const postVerifyUser = nonceRoute<boolean>((req: FastifyRequest, nonce: string) => {
  return verifyUser(req.body as VerifyUserRequest, nonce);
});

const updateUserAddress = authenticatedRoute<any>((req: FastifyRequest, user: User) =>
  updateUserWalletAddress(user, req.body as UpdateUserWalletByPathRequest)
);

const registerUserRoutes = (server: Server) => {
  server.post("/user/create", { schema: createUserSchema }, postCreateUser);
  server.post("/user/verify", { schema: verifyUserSchema }, postVerifyUser);
  server.post("/user/update-address", updateUserAddress);
};

const createUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["devicePublicKey"],
    properties: {
      devicePublicKey: { type: "string", maxLength: 130, minLength: 88 },
    },
  },
};

const verifyUserSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["devicePublicKey", "userId", "deviceSignature"],
    properties: {
      devicePublicKey: { type: "string", maxLength: 130, minLength: 88 },
      userId: { type: "string", maxLength: 36, minLength: 36 },
      deviceSignature: { type: "string", maxLength: 96, minLength: 96 },
    },
  },
};

export default registerUserRoutes;
