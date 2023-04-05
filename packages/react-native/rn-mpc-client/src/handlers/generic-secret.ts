import {
  MPCWebsocketHandler,
  MPCWebsocketMessage,
  WebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
} from '@superlight/mpc-common';
import { reset } from '@superlight/rn-crypto-mpc';
import { StepResult } from '@superlight/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, combineLatest, firstValueFrom, map } from 'rxjs';
import { initGenerateGenericSecret, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { ShareResult } from '../lib/mpc/mpc-types';
import { RawData } from '../lib/websocket/websocket-client';

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

      ws.send(JSON.stringify({ type: 'inProgress', message: stepMsg.message }));

      return okAsync(stepMsg.share);
    });
};

export const generateGenericSecret: MPCWebsocketHandler<ShareResult> = (
  input: Observable<RawData>,
  share$: Observable<ResultAsync<string, WebsocketError>>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>
) => {
  const serverId$ = new Subject<string>();

  listenToWebSocket(input, serverId$);

  return ResultAsync.fromPromise(
    firstValueFrom(
      combineLatest([share$, serverId$]).pipe(map(([share, serverId]) => ({ share, serverId })))
    ),
    err => mapWebsocketToAppError(err)
  );
};

const listenToWebSocket = (input: Observable<RawData>, serverId$: Subject<string>) => {
  input.subscribe({
    next: message => onMessage(message, serverId$),
    error: err => {
      console.error({ err }, 'Error received from server on websocket');
      reset();
    },
    complete: () => {
      console.log('Connection on Websocket closed');
    },
  });
};

const onMessage = (message: RawData, serverId$: Subject<string>) => {
  const msg = JSON.parse(message.toString());

  // TODO validate structure of message

  serverId$.next(msg.result);
};
