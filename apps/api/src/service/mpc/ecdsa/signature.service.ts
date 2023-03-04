import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import { WebsocketError } from '@lib/routes/websocket/websocket-error';
import { MPCWebsocketMessage, MPCWebsocketResult } from '@lib/routes/websocket/websocket-types';
import { errAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { MpcKeyShare } from 'src/repository/key-share';
import { readKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { getKeyShare } from 'src/service/key-share.service';
import { createEcdsaSignContext } from 'src/service/mpc-context.service';
import { RawData } from 'ws';
import { step } from '../step/step';

export const signWithEcdsaKey = (
  user: User,
  messages: Observable<RawData>,
  initParameter: RawData
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  initSignProcess(initParameter, user.id)
    .map(context => {})
    .mapErr(err => output.next(errAsync(err)));
};

const initSignProcess = (
  message: RawData,
  userId: string
): ResultAsync<Context, WebsocketError> => {
  const { messageToSign, encoding, shareId } = JSON.parse(message.toString());

  return getKeyShare(shareId, userId).andThen(keyShare =>
    createEcdsaSignContext(keyShare.value, messageToSign, encoding)
  );
};

export const signWithEcdsaSharea = (connection: SocketStream, user: User) => {
  let context: Context;
  let status: SignStatus = 'InitShare';

  let share: MpcKeyShare;

  connection.socket.on('message', async message => {
    switch (status) {
      case 'InitShare':
        try {
          share = await readKeyShare(message.toString(), user.id);
          status = 'InitMessage';
          connection.socket.send(JSON.stringify({ value: 'ShareSet' }));
        } catch (err) {
          logger.error({ err }, 'Error while initiating signing');
          connection.socket.close(undefined, 'Error while initiating signing');
          context?.free();
          return;
        }
        break;

      case 'InitMessage':
        try {
          const { messageToSign, encoding } = JSON.parse(message.toString());
          logger.info(
            {
              parent: { id: share.id, path: share.path },
              messageToSign,
              encoding,
            },
            'INIT SIGN'
          );

          context =
            context ||
            Context.createEcdsaSignContext(
              2,
              Buffer.from(share.value, 'base64'),
              Buffer.from(messageToSign, encoding),
              true
            );

          connection.socket.send(JSON.stringify({ value: 'Start' }));

          status = 'Stepping';
        } catch (err) {
          logger.error({ err }, 'Error while starting signature');
          connection.socket.close(undefined, 'Error while starting signature');
          context.free();
        }
        break;
      case 'Stepping':
        try {
          const stepInput = message.toString();
          logger.info(
            { input: stepInput.slice(0, 23), contextPtr: context.contextPtr },
            'SIGN STEP'
          );

          const stepOutput = step(message.toString(), context);

          if (stepOutput === true) {
            logger.info('Completed Signature, closing connection');
            context.free();
            connection.socket.close(undefined, 'Completed Signature, closing connection');
            return;
          }

          connection.socket.send(stepOutput as string);
        } catch (err) {
          logger.error({ err }, 'Error while stepping in sign');
          context?.free();
        }
        break;
    }
  });

  connection.socket.on('error', err => {
    logger.error({ err }, 'error');
    context?.free();
  });
};
