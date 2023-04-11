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

// Without steps -> means, that the key can be fetched from the mpc context immediately on the server.
// Client side it is necessary to step once with `step(null)`
export const startDerive: MPCWebsocketStarterWithSetup<DeriveFrom, string> = ({
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
  const peerShareId$ = new Subject<string>();

  listenToWebSocket(input, peerShareId$);

  const peerShareIdResult = ResultAsync.fromPromise(firstValueFrom(peerShareId$), err =>
    other(err, 'Error while waiting for peerShareId on websocket')
  );

  return ResultAsync.combine([startResult, peerShareIdResult]).map(([share, peerShareId]) => ({
    share,
    peerShareId,
  }));
};

const listenToWebSocket = (
  input: Observable<MPCWebsocketMessage>,
  peerShareId$: Subject<string>
) => {
  input.subscribe({
    next: message => onMessage(message, peerShareId$),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      reset();
    },
  });
};

const onMessage = (message: MPCWebsocketMessage<string>, peerShareId$: Subject<string>) => {
  // TODO validate structure of message
  if (message && message.type === 'success') {
    peerShareId$.next(message.result);
    return;
  }

  peerShareId$.error(websocketError('No peerShareId received'));
};
