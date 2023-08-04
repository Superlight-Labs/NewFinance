import { Context } from '@crypto-mpc';
import { step } from '@lib/utils/crypto';
import logger from '@superlight-labs/logger';
import {
  MPCWebscocketInit,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  SignConfig,
  WebSocketOutput,
  WebsocketError,
  mpcInternalError,
  stepMessageError,
} from '@superlight-labs/mpc-common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { getKeyShare } from 'src/service/data/key-share.service';
import { createEcdsaSignContext } from 'src/service/mpc/mpc-context.service';

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
  const { messageToSign, encoding, peerShareId } = message.parameter;

  return getKeyShare(peerShareId, userId).andThen(keyShare =>
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

  const stepOutput = step(wsMsg, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync(stepOutput));
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
