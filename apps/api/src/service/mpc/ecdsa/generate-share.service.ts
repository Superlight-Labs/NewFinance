import { Context } from '@crypto-mpc';
import { step } from '@lib/utils/crypto';
import {
  databaseError,
  mpcInternalError,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  stepMessageError,
  WebsocketError,
  WebSocketOutput,
} from '@superlight-labs/mpc-common';
import { FastifyRequest } from 'fastify';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { createGenerateEcdsaKey } from '../mpc-context.service';

export const generateEcdsaKey = (req: FastifyRequest, user: User): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateEcdsaKey();

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
