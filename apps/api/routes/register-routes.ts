import { Server } from "@server";
import registerAuthRoutes from "./auth/auth-routes";
import registerMcpRoutes from "./mpc/mpc-routes";
import registerUserRoutes from "./user/user-routes";

export const registerRoutes = (server: Server): void => {
  registerUserRoutes(server);
  registerMcpRoutes(server);
  registerAuthRoutes(server);
};
