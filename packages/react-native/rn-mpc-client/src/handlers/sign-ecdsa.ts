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
import { getDerSignature, reset } from '@superlight-labs/rn-crypto-mpc';
import { StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Observable, Subject, firstValueFrom, from, map, mergeMap } from 'rxjs';
import { initSignEcdsa, step } from '../lib/mpc/mpc-neverthrow-wrapper';
import { SignWithShare } from '../lib/mpc/mpc-types';

export const startSign: MPCWebsocketStarterWithSetup<SignWithShare, null> = ({
  output,
  input,
  initParam,
}) => {
  return initSignEcdsa(initParam)
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

export const signEcdsa: MPCWebsocketHandlerWithSetup<string, null> = ({
  input,
  output,
  startResult: _,
}) => {
  const context$ = new Subject<string>();

  listenToWebSocket(input, output, context$);

  return ResultAsync.fromPromise(
    firstValueFrom(
      context$.pipe(
        mergeMap(context => from(getDerSignature(context))),
        map(shareResult => shareResult.signature)
      )
    ),
    err => other(err, 'Failed to derive Keys')
  );
};

const listenToWebSocket = (
  input: Observable<MPCWebsocketMessage>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  context$: Subject<string>
) => {
  input.subscribe({
    next: message => onMessage(message, output, context$),
    error: err => {
      logger.error({ err }, 'Error received from server on websocket');
      context$.error(err);
      reset();
    },
  });
};

const onMessage = (
  message: MPCWebsocketMessage<string>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  context$: Subject<string>
) => {
  // TODO validate structure of message
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

      output.next(okAsync({ type: 'inProgress', message: result.message }));
    },
    err => output.next(errAsync(websocketError(err)))
  );

  return;
};
