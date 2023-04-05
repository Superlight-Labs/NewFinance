import {
  MPCWebsocketHandler,
  MPCWebsocketMessage,
  WebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
} from '@superlight/mpc-common';
import { reset } from '@superlight/rn-crypto-mpc';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, combineLatest, firstValueFrom, map } from 'rxjs';
import { RawData } from 'ws';
import { initGenerateGenericSecret, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { ShareResult } from '../lib/mpc/mpc-types';

export const generateGenericSecret: MPCWebsocketHandler<ShareResult> = (
  input: Observable<RawData>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>
) => {
  const share$ = new Subject<string>();
  const serverId$ = new Subject<string>();

  initGenerateGenericSecret()
    .andThen(_ => step(null))
    .match(
      stepMsg => {
        if (stepMsg.type === 'error') {
          output.next(errAsync(mpcInternalError(stepMsg.error)));
          reset();
          return;
        }

        if (stepMsg.type === 'success') {
          output.complete();
          share$.next(stepMsg.share);
          reset();
          return;
        }

        output.next(okAsync({ type: 'inProgress', message: stepMsg.message }));

        listenToWebSocket(input, serverId$);
      },
      err => output.next(errAsync(err))
    );

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
      reset();
    },
  });
};

const onMessage = (message: RawData, serverId$: Subject<string>) => {
  const msg = JSON.parse(message.toString());

  // TODO validate structure of message

  serverId$.next(msg.result);
};
