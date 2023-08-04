import logger from '@superlight-labs/logger';
import {
  MPCWebsocketHandler,
  MPCWebsocketMessage,
  WebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
  websocketError,
} from '@superlight-labs/mpc-common';
import { reset } from '@superlight-labs/rn-crypto-mpc';
import { StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
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

      const wsMessage: MPCWebsocketMessage = {
        type: 'inProgress',
        message: stepMsg.message,
        compressed: false,
      };

      ws.send(JSON.stringify(wsMessage));

      return okAsync(stepMsg.share);
    });
};

export const generateGenericSecret: MPCWebsocketHandler<ShareResult, string> = ({
  input,
  startResult,
  output: _,
}) => {
  const peerShareId$ = new Subject<string>();

  listenToWebSocket(input, peerShareId$);

  const peerShareIdResult = ResultAsync.fromPromise(firstValueFrom(peerShareId$), err =>
    mapWebsocketToAppError(err)
  );

  return ResultAsync.combine([startResult, peerShareIdResult])
    .map(([share, peerShareId]) => ({
      share,
      peerShareId,
    }))
    .mapErr(mapWebsocketToAppError);
};

const listenToWebSocket = (
  input: Observable<MPCWebsocketMessage>,
  peerShareId$: Subject<string>
) => {
  input.subscribe({
    next: message => onMessage(message, peerShareId$),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      peerShareId$.error(err);
      reset();
    },
  });
};

const onMessage = (message: MPCWebsocketMessage, peerShareId$: Subject<string>) => {
  // TODO validate structure of message
  if (message && message.type === 'success') {
    peerShareId$.next(message.result);
    return;
  }

  peerShareId$.error(websocketError('No peerShareId received'));
};
