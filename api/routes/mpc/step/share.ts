import { SocketStream } from "@fastify/websocket";
import constants from "@lib/constants";
import logger from "@lib/logger";
import Context from "../../../crypto-mpc-js/lib/context";
import { User } from "../../user/user";
import { MpcKeyShare } from "../../user/wallet";
import {
  createBip44MasterKeyShare,
  createDerivedWallet,
  createWallet,
} from "../../user/wallet.repository";
import { DeriveConfig } from "../ecdsa/derive/deriveBIP32";

export const processDerivedShare = async (
  user: User,
  share: string,
  parent: MpcKeyShare,
  connection: SocketStream,
  deriveConfig: DeriveConfig
) => {
  try {
    const { path, id: serverShareId } = await saveDerivedShare(
      user,
      share,
      parent,
      deriveConfig
    );

    connection.socket.send(JSON.stringify({ done: true, serverShareId, path }));
    connection.socket.close(undefined, "Done saving Derived Share");
  } catch (err) {
    logger.error({ err }, "Error while saving Derived Share");
    connection.socket.close(undefined, "Error while saving Derived Share");
  }
};

const saveDerivedShare = async (
  user: User,
  share: string,
  parent: MpcKeyShare,
  deriveConfig: DeriveConfig
): Promise<MpcKeyShare> => {
  const wallet = await saveShareBasedOnPath(user, share, parent, deriveConfig);

  logger.info(
    {
      ...wallet,
      keyShare: wallet.keyShare?.slice(0, 23),
    },
    "Wallet main key derived"
  );

  return wallet;
};

const saveShareBasedOnPath = (
  user: User,
  share: string,
  parent: MpcKeyShare,
  deriveConfig: DeriveConfig
): Promise<MpcKeyShare> => {
  const path = buildPath(deriveConfig);

  if (deriveConfig.index === constants.bip44MasterIndex) {
    return createBip44MasterKeyShare(user, parent.id, share, path);
  }
  return createDerivedWallet(user, share, path);
};

export const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === "m") return "m";

  return `${parentPath}/${index}${hardened === "1" ? "'" : ""}`;
};

export const saveShare = async (
  user: User,
  context: Context,
  connection: SocketStream
) => {
  try {
    const wallet = await createWallet(
      user,
      context.getNewShare().toString("base64"),
      "ecdsa"
    );

    logger.info(
      {
        ...wallet,
        keyShare: wallet.keyShare?.slice(0, 23),
      },
      "Wallet main key derived"
    );

    connection.socket.send(
      JSON.stringify({ done: true, serverShareId: wallet.id })
    );
    connection.socket.close(undefined, "Done Generating Ecdsa Key Shares");
  } catch (err) {
    logger.error({ err }, "Error while saving main key from Ecdas Init");
    connection.socket.close(
      undefined,
      "Error while saving main key from Ecdas Init"
    );
  }
};
