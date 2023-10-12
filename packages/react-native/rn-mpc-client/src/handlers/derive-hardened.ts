import logger from '@superlight-labs/logger';
import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketMessage,
  MPCWebsocketStarterWithSetup,
  WebsocketError,
  mpcInternalError,
  other,
  websocketError,
} from '@superlight-labs/mpc-common';
import { getResultDeriveBIP32, reset } from '@superlight-labs/rn-crypto-mpc';
import { StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, combineLatest, firstValueFrom, from, map, mergeMap } from 'rxjs';
import { initDeriveBip32, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { DeriveFrom, ShareResult } from '../lib/mpc/mpc-types';

// With Steps means that there are multiple steps necessary on client and server to create a keypair
// Usually used for hardened key derivation. One exception is the derivation of the master key from the seed shared,
// which is non-hardened, but via multiple steps
export const startDeriveWithSteps: MPCWebsocketStarterWithSetup<DeriveFrom, null> = ({
  output,
  input,
  initParam,
}) => {
  return initDeriveBip32(initParam, initParam.hardened)
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

export const deriveBip32WithSteps: MPCWebsocketHandlerWithSetup<ShareResult, null> = ({
  input,
  output,
  startResult: _,
}) => {
  const { peerShareId$, context$ } = {
    peerShareId$: new Subject<string>(),
    context$: new Subject<string>(),
  };

  listenToWebSocket(input, output, { peerShareId$, context$ });

  return ResultAsync.fromPromise(
    firstValueFrom(
      combineLatest({
        peerShareId: peerShareId$,
        share: context$.pipe(
          mergeMap(context => from(getResultDeriveBIP32(context))),
          map(shareResult => shareResult.keyShare)
        ),
      })
    ),
    err => other(err, 'Failed to derive Keys')
  );
};

const listenToWebSocket = (
  input: Observable<MPCWebsocketMessage>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  result: DeriveResult
) => {
  input.subscribe({
    next: message => onMessage(message, output, result),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      result.context$.error(err);
      reset();
    },
  });
};

const onMessage = (
  message: MPCWebsocketMessage<string>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  { peerShareId$, context$ }: DeriveResult
) => {
  // TODO validate structure of message
  if (message && message.type === 'success') {
    peerShareId$.next(message.result);
    return;
  }

  if (message.type !== 'inProgress') {
    output.next(errAsync(websocketError('Unexpected message received from server')));
    return;
  }

  step(message.message).match(
    result => {
      if (result.type === 'error') {
        output.next(errAsync(websocketError(result.error)));
        return;
      }

      if (result.type === 'success') {
        context$.next(result.context);
      }

      if (result.message.length > 10000000) {
        const half = Math.floor(result.message.length / 2);

        const wsMessage1: MPCWebsocketMessage = {
          type: 'inProgress',
          message: result.message.slice(0, half),
        };
        const wsMessage2: MPCWebsocketMessage = {
          type: 'inProgress',
          message: result.message.slice(half),
        };

        output.next(okAsync({ ...wsMessage1, part: 1 }));

        setTimeout(() => output.next(okAsync({ ...wsMessage2, part: 2 })), 500);
      } else {
        output.next(okAsync({ type: 'inProgress', message: result.message }));
      }
    },
    err => output.next(errAsync(websocketError(err)))
  );

  return;
};

type DeriveResult = {
  peerShareId$: Subject<string>;
  context$: Subject<string>;
};
