import logger from '@superlight/logger';
import {
  ApiConfig,
  AppError,
  HandlerWithSetupParams,
  MPCWebsocketMessage,
  MPCWebsocketStarterWithSetup,
  StarterWithSetupParams,
  WebsocketError,
  mapWebsocketToAppError,
  websocketError,
} from '@superlight/mpc-common';
import { startWebsocketError } from '@superlight/mpc-common/src/error';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Subject, firstValueFrom, tap } from 'rxjs';
import {
  Signer,
  createNonce,
  createWebsocket,
  listenToWebsocket,
  logIncommingMessages,
} from './ws-common';

export const authWebsocketWithSetup =
  <Init = string, StartRes = string>(apiConfig: ApiConfig, sign: Signer, initParam: Init) =>
  <T>(
    starter: MPCWebsocketStarterWithSetup<Init, StartRes>,
    handleMessages: (params: HandlerWithSetupParams<StartRes>) => ResultAsync<T, AppError>
  ): ResultAsync<T, AppError> => {
    const input = new Subject<MPCWebsocketMessage>();
    const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

    return createNonce(apiConfig.baseUrl)
      .andThen(sign)
      .andThen(signResult => createWebsocket({ signResult, apiConfig }))
      .map(ws => {
        ws.onopen = () => ws.send(JSON.stringify({ type: 'init', parameter: initParam }));
        return ws;
      })
      .map(ws => {
        listenToWebsocket(input, output, ws);
        return { input: input.pipe(tap(logIncommingMessages)), output, initParam };
      })
      .andThen(waitForStart)
      .andThen(starter)
      .andThen(handleMessages)
      .mapErr(mapWebsocketToAppError);
  };

export const waitForStart = <T>({
  input,
  output,
  initParam,
}: StarterWithSetupParams<T>): ResultAsync<StarterWithSetupParams<T>, WebsocketError> => {
  const initParameter = ResultAsync.fromPromise(firstValueFrom(input), err =>
    websocketError('Error while waiting for start signal')
  );

  const evaluateStart = (message: MPCWebsocketMessage) => {
    logger.debug('Received message message on start of client websocket');

    if (message.type !== 'start') {
      return errAsync(startWebsocketError());
    }

    return okAsync({ input, output, initParam });
  };

  return initParameter.andThen(evaluateStart);
};
