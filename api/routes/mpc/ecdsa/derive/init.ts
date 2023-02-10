import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { RawData } from "ws";
import Context from "../../../../crypto-mpc-js/lib/context";
import { deleteWallet, getWallet, getWalletByPath } from "../../../user/wallet.repository";
import { buildPath } from "../../step/share";
import { DeriveConfig, DeriveContext } from "./deriveBIP32";

export const initDerive = async (
  message: RawData,
  connection: SocketStream,
  userId: string
): Promise<DeriveContext> => {
  const deriveConfig = JSON.parse(message.toString()) as DeriveConfig;

  try {
    const path = buildPath(deriveConfig);
    const existingWallet = await getWalletByPath(path, userId);

    existingWallet && (await deleteWallet(existingWallet));
  } catch (err) {
    logger.error({ err }, "Error while checking if keyshare has already been derived by user");
  }

  return setupContext(deriveConfig, connection, userId);
};

const setupContext = async (
  deriveConfig: DeriveConfig,
  connection: SocketStream,
  userId: string
): Promise<DeriveContext> => {
  try {
    const parent = await getWallet(deriveConfig.serverShareId, userId);

    logger.info({ parent: { id: parent.id, path: parent.path }, deriveConfig }, "INIT DERIVE");

    const context = Context.createDeriveBIP32Context(
      2,
      Buffer.from(parent.keyShare as string, "base64"),
      Number(deriveConfig.hardened) === 1,
      Number(deriveConfig.index)
    );

    connection.socket.send(JSON.stringify({ value: "Start" }));

    return { deriveConfig, parent, context };
  } catch (err) {
    logger.error({ err }, "Error while initiating Derive Bip32");
    connection.socket.close(undefined, "Error while initiating Derive Bip32");
    throw err;
  }
};
