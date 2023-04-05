import { Context } from '@crypto-mpc';
import logger from '@lib/logger';
import { step } from '@lib/utils/crypto';
import {
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
  WebsocketError,
  mpcInternalError,
} from '@superlight/mpc-common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { createEcdsaSignContext } from 'src/service/mpc/mpc-context.service';
import { getKeyShare } from 'src/service/persistance/key-share.service';
import { RawData } from 'ws';

export const signWithEcdsaKey = (
  user: User,
  messages: Observable<RawData>,
  initParameter: RawData
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  initSignProcess(initParameter, user.id).match(
    context => {
      messages.subscribe({
        next: message => signStep(context, message, output),
        error: err => {
          logger.error({ err, user: user.id }, 'Error received from client on websocket');
          context.free();
        },
        complete: () => {
          logger.info({ user: user.id }, 'Connection on Websocket closed');
          context.free();
        },
      });
    },
    err => output.next(errAsync(err))
  );

  return output;
};

const initSignProcess = (
  message: RawData,
  userId: string
): ResultAsync<Context, WebsocketError> => {
  // TODO come up with some message validation
  const { messageToSign, encoding, shareId } = JSON.parse(message.toString());

  return getKeyShare(shareId, userId).andThen(keyShare =>
    createEcdsaSignContext(keyShare.value, messageToSign, encoding)
  );
};

export const signStep = (context: Context, message: RawData, output: WebSocketOutput) => {
  const stepInput = message.toString();
  logger.info({ input: stepInput.slice(0, 23), contextPtr: context.contextPtr }, 'SIGN STEP');

  const msg = JSON.parse(message.toString());

  const stepOutput = step(msg.message, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
    return;
  }

  if (stepOutput.type === 'success') {
    logger.info('Completed Signature, closing connection');
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
