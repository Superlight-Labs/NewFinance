import { Context } from '@crypto-mpc';
import { step } from '@lib/utils/crypto';
import logger from '@superlight-labs/logger';
import {
  MPCWebsocketMessage,
  SignWithShare,
  WebSocketOutput,
  WebsocketError,
  mpcInternalError,
  stepMessageError,
} from '@superlight-labs/mpc-common';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { getKeyShare } from 'src/service/data/key-share.service';
import { createEcdsaSignContext } from 'src/service/mpc/mpc-context.service';

export const initSignProcess = (
  message: SignWithShare,
  userId: string
): ResultAsync<Context, WebsocketError> => {
  const { messageToSign, encoding, peerShareId } = message;

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

  const stepOutput = step(wsMsg.message, context);

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
