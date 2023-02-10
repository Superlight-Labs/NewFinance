import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { User } from "../../user/user";
import { ActionStatus } from "../mpc-routes";
import { processGenericSecret } from "../step/secret";
import { step } from "../step/step";

export const importGenericSecret = (connection: SocketStream, user: User) => {
  let context: Context;
  let status: ActionStatus = "Init";

  connection.socket.on("message", (message) => {
    switch (status) {
      case "Init":
        context = Context.createImportGenericSecretContext(2, 256, message);
        status = "Stepping";
        connection.socket.send(JSON.stringify({ value: "Start" }));
        break;

      case "Stepping":
        {
          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            processGenericSecret(user, context, connection)
              .then((_) => context.free())
              .catch((err) => {
                logger.error({ err }, "Error while Storing Imported Secret");
                context.free();
              });
            return;
          }

          connection.socket.send(stepOutput);
        }
        break;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "error");
    context?.free();
  });
};
