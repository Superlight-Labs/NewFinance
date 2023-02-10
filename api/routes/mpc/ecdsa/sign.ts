import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { User } from "../../user/user";
import { MpcKeyShare } from "../../user/wallet";
import { getWallet } from "../../user/wallet.repository";
import { step } from "../step/step";

type SignStatus = "InitShare" | "InitMessage" | "Stepping";

export const signWithEcdsaShare = (connection: SocketStream, user: User) => {
  let context: Context;
  let status: SignStatus = "InitShare";

  let share: MpcKeyShare;

  connection.socket.on("message", async (message) => {
    switch (status) {
      case "InitShare":
        try {
          share = await getWallet(message.toString(), user.id);
          status = "InitMessage";
          connection.socket.send(JSON.stringify({ value: "ShareSet" }));
        } catch (err) {
          logger.error({ err }, "Error while initiating signing");
          connection.socket.close(undefined, "Error while initiating signing");
          context?.free();
          return;
        }
        break;

      case "InitMessage":
        try {
          const { messageToSign, encoding } = JSON.parse(message.toString());
          logger.info({ parent: { id: share.id, path: share.path }, messageToSign, encoding }, "INIT SIGN");

          context =
            context ||
            Context.createEcdsaSignContext(
              2,
              Buffer.from(share.keyShare, "base64"),
              Buffer.from(messageToSign, encoding),
              true
            );

          connection.socket.send(JSON.stringify({ value: "Start" }));

          status = "Stepping";
        } catch (err) {
          logger.error({ err }, "Error while starting signature");
          connection.socket.close(undefined, "Error while starting signature");
          context.free();
        }
        break;
      case "Stepping":
        try {
          const stepInput = message.toString();
          logger.info({ input: stepInput.slice(0, 23), contextPtr: context.contextPtr }, "SIGN STEP");

          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            logger.info("Completed Signature, closing connection");
            context.free();
            connection.socket.close(undefined, "Completed Signature, closing connection");
            return;
          }

          connection.socket.send(stepOutput);
        } catch (err) {
          logger.error({ err }, "Error while stepping in sign");
          context?.free();
        }
        break;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "error");
    context?.free();
  });
};
