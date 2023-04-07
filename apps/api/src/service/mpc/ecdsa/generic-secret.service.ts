import { Context } from '@crypto-mpc';
import { step } from '@lib/utils/crypto';
import logger from '@superlight/logger';
import {
  MPCWebscocketInit,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
  WebsocketError,
  databaseError,
  mpcInternalError,
  stepMessageError,
} from '@superlight/mpc-common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import {
  createGenerateGenericSecretContext,
  createImportGenericSecretContext,
} from 'src/service/mpc/mpc-context.service';

export const generateGenericSecret = (
  user: User,
  messages: Observable<MPCWebsocketMessage>
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateGenericSecretContext()
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

export const importGenericSecret = (
  user: User,
  messages: Observable<MPCWebsocketMessage>,
  initParameter: MPCWebscocketInit
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  logger.debug({ initParameter }, 'Received init parameter and sent starting stuff');

  createImportGenericSecretContext(Buffer.from(initParameter.parameter, 'hex'))
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

const onMessage = (
  message: MPCWebsocketMessage,
  context: Context,
  output: WebSocketOutput,
  user: User
) => {
  if (message.type !== 'inProgress') {
    output.next(errAsync(stepMessageError('Invalid message recieved from client')));
    return;
  }

  const stepOutput = step(message.message, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
    return;
  }

  if (stepOutput.type === 'success') {
    const keyShare = context.getNewShare().toString('base64');

    output.next(saveGenericSecret(user, keyShare));
    context.free();
    return;
  }

  if (stepOutput.type === 'error') {
    output.next(errAsync(mpcInternalError(stepOutput.error, 'Error while stepping in context')));
    context.free();
    return;
  }

  throw new Error('Unexpected step output');
};

const saveGenericSecret = (
  user: User,
  keyShare: string
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  return ResultAsync.fromPromise(saveKeyShare(user, keyShare, 'secret'), err =>
    databaseError(err, 'Error while saving generic secret key share')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};
