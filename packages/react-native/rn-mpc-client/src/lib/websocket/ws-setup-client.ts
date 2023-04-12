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
  <InitParam = string, StartRes = string>(
    apiConfig: ApiConfig,
    sign: Signer,
    initParam: InitParam
  ) =>
  <T>(
    starter: MPCWebsocketStarterWithSetup<InitParam, StartRes>,
    handleMessages: (params: HandlerWithSetupParams<StartRes>) => ResultAsync<T, AppError>
  ): ResultAsync<T, AppError> => {
    const input = new Subject<MPCWebsocketMessage>();
    const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

    return createNonce(apiConfig.baseUrl)
      .andThen(sign)
      .andThen(signResult => createWebsocket({ signResult, apiConfig }))
      .map(ws => {
        ws.onopen = () =>
          ws.send(JSON.stringify({ type: 'init', parameter: cleanInitParam(initParam) }));
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
    websocketError(err, 'Error while waiting for start signal')
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

// For convenience we allow the init parameter to contain sensitive data like the share value
// we have to remove all sensitive data before sending it
const cleanInitParam = <T>(initParam: T) => {
  if (typeof initParam === 'string') {
    return initParam;
  }

  const parameter = { ...initParam };
  if (typeof parameter === 'object' && parameter && 'share' in parameter) {
    delete parameter.share;
  }

  return parameter;
};
