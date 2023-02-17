import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import { db } from '@lib/dev-db';
import logger from '@lib/logger';
import { Buffer } from 'buffer';
import { ActionStatus } from '../mpc-routes';
import { step } from '../step';

export const signWithEcdsaShare = (connection: SocketStream) => {
  let context: Context;
  let status: ActionStatus = 'Init';

  // TODO remove this in favor of real datbase and make sure to *await* the share. Mabye pass the share as parameter to justify the name of the method (...withEcdsaShare)
  const share = db.shareBuf;

  connection.socket.on('message', (message) => {
    switch (status) {
      case 'Init':
        context = Context.createEcdsaSignContext(
          2,
          share,
          Buffer.from(message.toString(), 'base64'),
          true
        );
        status = 'Stepping';
        connection.socket.send(JSON.stringify({ value: 'Start' }));
        break;
      case 'Stepping':
        stepWithMessage(connection, message, context);
        break;
    }
  });

  connection.socket.on('error', (err) => {
    logger.error({ err }, 'error on sign ecdsa socket');
  });
};

const stepWithMessage = (connection, message, context): void => {
  const stepOutput = step(message.toString(), context);
  if (stepOutput === true) {
    db.signature = context.getSignature();

    connection.socket.close();
    return;
  }

  connection.socket.send(stepOutput);
};
