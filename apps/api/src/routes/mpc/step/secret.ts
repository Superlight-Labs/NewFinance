import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { createWallet } from "../../user/wallet.repository";

export const processGenericSecret = async (
  user: User,
  context: Context,
  connection: SocketStream
) => {
  try {
    const wallet = await createWallet(
      user,
      context.getNewShare().toString("base64"),
      "secret"
    );

    logger.info(
      {
        ...wallet,
        genericSecret: wallet.keyShare?.slice(0, 23),
      },
      "Generic Secret Created"
    );

    connection.socket.send(
      JSON.stringify({ done: true, serverShareId: wallet.id })
    );
    connection.socket.close(undefined, "Done creating Secret Shares");
  } catch (err) {
    logger.error({ err }, "Error while saving generic Secret from generate");
    connection.socket.close(
      undefined,
      "Error while saving generic Secret from generate"
    );
  }
};
