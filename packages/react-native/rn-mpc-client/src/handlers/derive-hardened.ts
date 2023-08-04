import { decode } from '@msgpack/msgpack';
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
    .andThen(stepMsg => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }

      if (stepMsg.type === 'success') {
        reset();
        return errAsync(mpcInternalError('Unexpected success message received from server'));
      }

      const wsMessage: MPCWebsocketMessage = {
        type: 'inProgress',
        message: stepMsg.message as string,
        compressed: false,
      };

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

  logger.info({ compressed: message.compressed, type: typeof message.message }, 'watta client');
  const stepIn = message.compressed ? (decode(message.message) as string) : message.message;

  step(stepIn).match(
    result => {
      if (result.type === 'error') {
        output.next(errAsync(websocketError(result.error)));
        return;
      }

      if (result.type === 'success') {
        context$.next(result.context);
      }

      output.next(
        okAsync({ type: 'inProgress', message: result.message as string, compressed: false })
      );
    },
    err => output.next(errAsync(websocketError(err)))
  );

  return;
};

type DeriveResult = {
  peerShareId$: Subject<string>;
  context$: Subject<string>;
};
