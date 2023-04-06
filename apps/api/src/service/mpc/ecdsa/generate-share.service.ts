import { Context } from '@crypto-mpc';
import logger from '@lib/logger';
import { step } from '@lib/utils/crypto';
import {
  databaseError,
  mpcInternalError,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  stepMessageError,
  WebsocketError,
  WebSocketOutput,
} from '@superlight/mpc-common';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { createGenerateEcdsaKey } from '../mpc-context.service';

export const generateEcdsaKey = (
  user: User,
  messages: Observable<MPCWebsocketMessage>
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateEcdsaKey().match(
    context => {
      messages.subscribe({
        next: message => onMessage(message, context, output, user),
        error: err => {
          logger.error({ err, user: user.id }, 'Error received from client on websocket');
          context.free();
        },
        complete: () => {
          logger.info({ user: user.id }, 'Connection on Websocket closed');
          context.free;
        },
      });
    },
    err => output.next(errAsync(err))
  );

  return output;
};

const onMessage = (
  wsMsg: MPCWebsocketMessage,
  context: Context,
  output: WebSocketOutput,
  user: User
) => {
  if (!wsMsg || wsMsg.type !== 'inProgress') {
    output.next(errAsync(stepMessageError('Invalid Step Message, closing connection')));
    return;
  }

  const stepOutput = step(wsMsg.message, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
    return;
  }

  if (stepOutput.type === 'success') {
    const keyShare = context.getNewShare().toString('base64');

    output.next(saveGeneratedShare(user, keyShare));
    context.free();
    return;
  }

  if (stepOutput.type === 'error') {
    output.next(errAsync(mpcInternalError(stepOutput.error)));
    context.free();
    return;
  }

  throw new Error('Unexpected step output');
};

const saveGeneratedShare = (
  user: User,
  keyShare: string
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  return ResultAsync.fromPromise(saveKeyShare(user, keyShare, 'ecdsa'), err =>
    databaseError(err, 'Error while saving newly generated ecdsa share')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};
