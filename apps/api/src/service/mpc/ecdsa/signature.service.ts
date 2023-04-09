import { Context } from '@crypto-mpc';
import { SignConfig, step } from '@lib/utils/crypto';
import logger from '@superlight/logger';
import {
  MPCWebscocketInit,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
  WebsocketError,
  mpcInternalError,
  stepMessageError,
} from '@superlight/mpc-common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { createEcdsaSignContext } from 'src/service/mpc/mpc-context.service';
import { getKeyShare } from 'src/service/persistance/key-share.service';

export const signWithEcdsaKey = (
  user: User,
  messages: Observable<MPCWebsocketMessage>,
  initParameter: MPCWebscocketInit<SignConfig>
): MPCWebsocketResult<undefined> => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage<undefined>, WebsocketError>>();

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
  message: MPCWebscocketInit<SignConfig>,
  userId: string
): ResultAsync<Context, WebsocketError> => {
  // TODO come up with some message validation
  const { messageToSign, encoding, shareId } = message.parameter;

  return getKeyShare(shareId, userId).andThen(keyShare =>
    createEcdsaSignContext(keyShare.value, messageToSign, encoding)
  );
};

export const signStep = (
  context: Context,
  wsMsg: MPCWebsocketMessage,
  output: WebSocketOutput<undefined>
) => {
  if (!wsMsg || wsMsg.type !== 'inProgress') {
    output.next(errAsync(stepMessageError('Invalid Step Message, closing connection')));
    return;
  }

  logger.info({ input: wsMsg.message.slice(0, 23), contextPtr: context.contextPtr }, 'SIGN STEP');

  const msg = JSON.parse(wsMsg.toString());

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
