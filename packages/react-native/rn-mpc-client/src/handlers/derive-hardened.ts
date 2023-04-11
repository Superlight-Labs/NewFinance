import logger from '@superlight/logger';
import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketMessage,
  MPCWebsocketStarterWithSetup,
  WebsocketError,
  mpcInternalError,
  other,
  websocketError,
} from '@superlight/mpc-common';
import { reset } from '@superlight/rn-crypto-mpc';
import { StepResult } from '@superlight/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, combineLatest, firstValueFrom, map } from 'rxjs';
import { initDeriveBip32, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { DeriveFrom, ShareResult } from '../lib/mpc/mpc-types';

export const startDeriveHardened: MPCWebsocketStarterWithSetup<DeriveFrom, null> = ({
  output,
  input,
  initParam,
}) => {
  return initDeriveBip32(initParam, false)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }

      const wsMessage: MPCWebsocketMessage = { type: 'inProgress', message: stepMsg.message };
      output.next(okAsync(wsMessage));

      return okAsync({ startResult: okAsync(null), input, output });
    });
};

export const deriveBip32Hardened: MPCWebsocketHandlerWithSetup<ShareResult, null> = ({
  input,
  output,
  startResult: _,
}) => {
  const result$ = new Subject<ShareResult>();

  listenToWebSocket(input, output, result$);

  return ResultAsync.fromPromise(firstValueFrom(result$), err =>
    other(err, 'Failed to derive Keys')
  );
};

const listenToWebSocket = (
  input: Observable<MPCWebsocketMessage>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  result$: Subject<ShareResult>
) => {
  input.subscribe({
    next: message => onMessage(message, output, result$),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      result$.error(err);
      reset();
    },
    complete: () => {
      logger.debug('Connection on Websocket closed');
    },
  });
};

const onMessage = (
  message: MPCWebsocketMessage<string>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  result$: Subject<ShareResult>
): Observable<ShareResult> => {
  const peerShareId$ = new Subject<string>();
  const share$ = new Subject<string>();

  combineLatest([peerShareId$, share$])
    .pipe(map(([peerShareId, share]) => ({ peerShareId, share })))
    .subscribe(val => result$.next(val));

  // TODO validate structure of message
  if (message && message.type === 'success') {
    peerShareId$.next(message.result);
    return result$;
  }

  if (message.type !== 'inProgress') {
    output.next(errAsync(websocketError('Unexpected message received from server')));
    return result$;
  }

  step(message.message).match(
    result => {
      if (result.type === 'error') {
        output.next(errAsync(websocketError(result.error)));
        return;
      }

      if (result.type === 'success') {
        share$.next(result.share);
      }

      output.next(okAsync({ type: 'inProgress', message: result.message }));
    },
    err => output.next(errAsync(websocketError(err)))
  );

  return result$;
};
