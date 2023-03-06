import { Context } from '@crypto-mpc';
import logger from '@lib/logger';
import {
  databaseError,
  mpcInternalError,
  WebsocketError,
} from '@lib/routes/websocket/websocket-error';
import {
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
} from '@lib/routes/websocket/websocket-types';
import { step } from '@lib/utils/crypto';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { RawData } from 'ws';
import { createGenerateEcdsaKey } from './../../mpc-context.service';

export const generateEcdsaKey = (user: User, messages: Observable<RawData>): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateEcdsaKey()
    .map(context =>
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
      })
    )
    .mapErr(err => output.next(errAsync(err)));

  return output;
};

const onMessage = (message: RawData, context: Context, output: WebSocketOutput, user: User) => {
  const stepOutput = step(message.toString(), context);

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
    output.next(errAsync(mpcInternalError()));
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
