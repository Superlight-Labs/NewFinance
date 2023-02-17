import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import { db } from '@lib/dev-db';
import logger from '@lib/logger';
import { step } from '../step';

export const initGenerateEcdsaKey = (connection: SocketStream) => {
  let context: Context;

  connection.socket.on('message', (message) => {
    if (!context) context = Context.createGenerateEcdsaKey(2);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      // TODO: Remove this in favor of real database
      db.shareBuf = context.getNewShare();

      connection.socket.close();
      return;
    }

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on('error', (err) => {
    logger.error({ err }, 'error on init ecdsa socket');
  });
};
