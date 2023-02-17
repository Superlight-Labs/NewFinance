import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import { db } from '@lib/dev-db';
import logger from '@lib/logger';
import { step } from '../step';

export const initDeriveBIP32 = (connection: SocketStream) => {
  let context: Context;

  const index = db.shareBuf ? 44 : 0;
  const hardened = db.shareBuf ? 1 : 0;
  const share = db.shareBuf || db.secretBuf;

  connection.socket.on('message', (message) => {
    if (!context)
      context = Context.createDeriveBIP32Context(2, share, hardened, index);

    const stepOutput = step(message.toString(), context);

    if (stepOutput === true) {
      // TODO: Remove this in favor of real database
      db.shareBuf = context.getNewShare();

      connection.socket.close();
      return;
    }

    if (stepOutput === false) return;

    connection.socket.send(stepOutput as string);
  });

  connection.socket.on('error', (err) => {
    logger.error({ err }, 'error on derive socket');
  });
};
