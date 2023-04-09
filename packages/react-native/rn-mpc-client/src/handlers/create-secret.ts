import logger from '@superlight/logger';
import {
  MPCWebsocketHandler,
  MPCWebsocketMessage,
  WebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
  websocketError,
} from '@superlight/mpc-common';
import { reset } from '@superlight/rn-crypto-mpc';
import { StepResult } from '@superlight/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { initGenerateGenericSecret, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { ShareResult } from '../lib/mpc/mpc-types';

export const startGenerateGenericSecret = (ws: WebSocket): ResultAsync<string, WebsocketError> => {
  return initGenerateGenericSecret()
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }
      if (stepMsg.type !== 'success' || !stepMsg.share) {
        reset();
        return errAsync(mpcInternalError('No share received'));
      }

      const wsMessage: MPCWebsocketMessage = { type: 'inProgress', message: stepMsg.message };

      ws.send(JSON.stringify(wsMessage));

      return okAsync(stepMsg.share);
    });
};

export const generateGenericSecret: MPCWebsocketHandler<ShareResult, string> = ({
  input,
  startResult,
  output: _,
}) => {
  const serverId$ = new Subject<string>();

  listenToWebSocket(input, serverId$);

  const serverIdResult = ResultAsync.fromPromise(firstValueFrom(serverId$), err =>
    mapWebsocketToAppError(err)
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
      serverId$.error(err);
      reset();
    },
    complete: () => {
      logger.debug('Connection on Websocket closed');
    },
  });
};

const onMessage = (message: MPCWebsocketMessage, serverId$: Subject<string>) => {
  // TODO validate structure of message
  if (message && message.type === 'success') {
    serverId$.next(message.result);
    return;
  }

  serverId$.error(websocketError('No serverId received'));
};
