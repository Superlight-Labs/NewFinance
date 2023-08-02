import {
  ApiConfig,
  AppError,
  HandlerParams,
  MPCWebsocketMessage,
  MPCWebsocketStarter,
  WebsocketError,
  mapWebsocketToAppError,
} from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { Subject, tap } from 'rxjs';
import {
  Signer,
  createNonce,
  createWebsocket,
  listenToWebsocket,
  logIncommingMessages,
  unwrapStartResult,
} from './ws-common';

export const authWebsocket =
  (apiConfig: ApiConfig, sign: Signer) =>
  <Result = string, StartProduct = string>(
    starter: MPCWebsocketStarter<StartProduct>,
    handleMessages: (params: HandlerParams<StartProduct>) => ResultAsync<Result, WebsocketError>
  ): ResultAsync<Result, AppError> => {
    const input = new Subject<MPCWebsocketMessage>();
    const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

    return createNonce(apiConfig.baseUrl)
      .andThen(sign)
      .andThen(signResult => createWebsocket({ signResult, apiConfig }))
      .map(ws => {
        const startResult$ = new Subject<ResultAsync<StartProduct, WebsocketError>>();
        ws.onopen = () => startResult$.next(starter(ws));
        return { startResult$, ws };
      })
      .andThen(({ startResult$, ws }) => unwrapStartResult(startResult$, ws))
      .map(({ startResult, ws }) => {
        listenToWebsocket(input, output, ws);
        return { input: input.pipe(tap(logIncommingMessages)), startResult, output };
      })
      .andThen(handleMessages)
      .mapErr(err => mapWebsocketToAppError(err));
  };
