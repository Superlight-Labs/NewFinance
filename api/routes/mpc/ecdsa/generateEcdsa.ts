import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { User } from "../../user/user";
import { saveShare } from "../step/share";
import { step } from "../step/step";

export const generateEcdsaKey = (connection: SocketStream, user: User) => {
  let context: Context;

  connection.socket.on("message", (message) => {
    if (!context) context = Context.createGenerateEcdsaKey(2);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      saveShare(user, context, connection)
        .then((_) => context.free())
        .catch((err) => {
          logger.error({ err }, "Error while Storing Generated Ecdsa Share");
          context.free();
        });
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on Init Ecdsa Websocket");
    context?.free();
  });
};
