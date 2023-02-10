import { Context } from "@crypto-mpc";
import { SocketStream } from "@fastify/websocket";
import logger from "@lib/logger";
import { RawData } from "ws";
import { User } from "../../../user/user";
import { MpcKeyShare } from "../../../user/wallet";
import { ActionStatus } from "../../mpc-routes";
import { processDerivedShare } from "../../step/share";
import { step } from "../../step/step";
import { initDerive } from "./init";

export const deriveBIP32 = async (connection: SocketStream, user: User) => {
  let status: ActionStatus = "Init";
  let deriveContext: DeriveContext;

  connection.socket.on("message", async (message: RawData) => {
    switch (status) {
      case "Init":
        deriveContext = await initDerive(message, connection, user.id);
        status = "Stepping";
        return;
      case "Stepping":
        {
          const input = message.toString();

          if (input === "nonhardened") {
            const share = deriveContext.context
              .getResultDeriveBIP32()
              .toBuffer()
              .toString("base64");

            processDerivedShare(
              user,
              share,
              deriveContext.parent,
              connection,
              deriveContext.deriveConfig
            );

            return;
          }

          deriveStep(message, deriveContext, user, connection);
        }
        return;
    }
  });

  connection.socket.on("error", (err) => {
    logger.error({ err }, "Error on derive BIP32");
    deriveContext?.context?.free();
  });

  connection.socket.on("close", (code, reason) => {
    logger.info(
      { code, reason: reason?.toString() },
      "Closed Derive BIP32 Connection"
    );
    deriveContext?.context?.free();
  });
};

const deriveStep = async (
  message: RawData,
  deriveContext: DeriveContext,
  user: User,
  connection: SocketStream
) => {
  try {
    const { context, parent, deriveConfig } = deriveContext;

    if (!context || context.contextPtr == null) {
      connection.socket.close(
        undefined,
        "Context undefined during Stepping, closing connection"
      );
      return;
    }

    const stepInput = message.toString();

    if (!stepInput || stepInput === "") {
      connection.socket.close(
        undefined,
        "Invalid Step Message, closing connection"
      );
      return;
    }

    logger.info(
      { input: stepInput.slice(0, 23), contextPtr: context.contextPtr },
      "DERIVE STEP"
    );

    const stepOutput = step(stepInput, context);

    if (stepOutput === true) {
      const share = context.getNewShare().toString("base64");

      processDerivedShare(user, share, parent, connection, deriveConfig)
        .then((_) => context.free())
        .catch((err) => {
          logger.error({ err }, "Error while Storing Derived Share");
          context.free();
        });

      return;
    }

    if (stepOutput === false) return;

    connection.socket.send(stepOutput as string);
  } catch (err) {
    logger.error({ err }, "Error while Performing Derive Steps");
    deriveContext.context?.free();
  }
};

export type DeriveConfig = {
  serverShareId: string;
  index: string;
  hardened: string;
  parentPath: string;
};

export type DeriveContext = {
  deriveConfig: DeriveConfig;
  parent: MpcKeyShare;
  context: Context;
};
