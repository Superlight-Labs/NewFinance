import logger from '@superlight/logger';
import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketMessage,
  MPCWebsocketStarterWithSetup,
  mpcInternalError,
  other,
  websocketError,
} from '@superlight/mpc-common';
import { reset } from '@superlight/rn-crypto-mpc';
import { StepResult } from '@superlight/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { initDeriveBip32, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { DeriveFrom, ShareResult } from '../lib/mpc/mpc-types';

export const startDerive: MPCWebsocketStarterWithSetup<DeriveFrom, string> = ({
  output,
  input,
  initParam,
}) => {
  return initDeriveBip32(initParam)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }

      if (stepMsg.type !== 'success' || !stepMsg.context) {
        reset();
        return errAsync(mpcInternalError('No context received'));
      }

      const wsMessage: MPCWebsocketMessage<null> = { type: 'success', result: null };
      output.next(okAsync(wsMessage));

      return okAsync({ startResult: okAsync(stepMsg.context), input, output });
    });
};

export const deriveBip32: MPCWebsocketHandlerWithSetup<ShareResult, string> = ({
  input,
  output: _,
  startResult,
}) => {
  const serverId$ = new Subject<string>();

  listenToWebSocket(input, serverId$);

  const serverIdResult = ResultAsync.fromPromise(firstValueFrom(serverId$), err =>
    other(err, 'Error while waiting for serverId on websocket')
  );

  return ResultAsync.combine([startResult, serverIdResult]).map(([share, serverId]) => ({
    share,
    serverId,
  }));
};

const listenToWebSocket = (input: Observable<MPCWebsocketMessage>, serverId$: Subject<string>) => {
  input.subscribe({
    next: message => onMessage(message, serverId$),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      reset();
    },
    complete: () => {
      logger.debug('Connection on Websocket closed');
    },
  });
};

const onMessage = (message: MPCWebsocketMessage<string>, serverId$: Subject<string>) => {
  // TODO validate structure of message
  if (message && message.type === 'success') {
    serverId$.next(message.result);
    return;
  }

  serverId$.error(websocketError('No serverId received'));
};
