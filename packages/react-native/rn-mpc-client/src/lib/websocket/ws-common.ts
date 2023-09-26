import logger from '@superlight-labs/logger';
import {
  AppError,
  MPCWebsocketMessage,
  MpcWebsocketHandlerWrapper,
  SignResult,
  WebsocketConfig,
  WebsocketError,
  apiError,
  createMPCWebsocketHandlerWrapper,
  mapWebsocketToAppError,
  other,
  shortenMessage,
  websocketError,
} from '@superlight-labs/mpc-common';
import axios from 'axios';
import { Result, ResultAsync } from 'neverthrow';
import { Observable, Subject, firstValueFrom } from 'rxjs';

export type RawData = string | ArrayBufferLike | Blob | ArrayBufferView;
export type Signer = (nonce: string) => ResultAsync<SignResult, AppError>;

export const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(logger);

export type CreateWebsocketResult<T> = {
  startResult$: Observable<ResultAsync<T, WebsocketError>>;
  ws: WebSocket;
};

export const listenToWebsocket = (
  input: Subject<MPCWebsocketMessage>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>,
  ws: WebSocket
): void => {
  ws.onmessage = ({ data }) => input.next(JSON.parse(data.toString()) as MPCWebsocketMessage);
  ws.onerror = err => {
    input.error(err);
    logger.error({ err }, 'Websocket error');
  };
  ws.onclose = err => {
    if (err.code !== 1000) input.error(err);
    else input.complete();
  };

  wrapMPCWebsocketHandler(output, ws);
};

export const createNonce = (apiUrl: string): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(axios.get<CreateNonceResponse>(`${apiUrl}/auth/get-nonce`), err =>
    mapWebsocketToAppError(apiError(err, 'Error while creating nonce'))
  ).map(res => res.data.nonce);
};

export type CreateNonceResponse = {
  nonce: string;
};

export const createWebsocket = Result.fromThrowable(
  (config: WebsocketConfig) => {
    const { userId, devicePublicKey, signature } = config.signResult;
    const { baseUrl, socketEndpoint } = config.apiConfig;

    const baseUrlWithoutProtocol = baseUrl.replace(/(^\w+:|^)\/\//, '');

    // TODO check if JWT makes sense here, this is a bit custom
    try {
      const ws = new WebSocket(
        `${getProtocol()}://${baseUrlWithoutProtocol}/mpc/ecdsa/${socketEndpoint}`,
        null,
        {
          headers: {
            userid: userId,
            devicepublickey: devicePublicKey,
            signature,
          },
        }
      );

      return ws;
    } catch (err) {
      logger.error({ err }, "Couldn't create websocket");
      throw err;
    }
  },
  err => websocketError(err, "Couldn't create websocket")
);

export const unwrapStartResult = <T>(
  startResult$: Observable<ResultAsync<T, WebsocketError>>,
  ws: WebSocket
) => {
  return ResultAsync.fromPromise(firstValueFrom(startResult$), err =>
    other(err, 'Error while unwrapping start result')
  ).map(startResult => ({ startResult, ws }));
};

export const logIncommingMessages = {
  next: (message: MPCWebsocketMessage) =>
    logger.debug({ data: shortenMessage(message) }, 'Received message on websocket'),
  error: (err: unknown) => logger.error({ err }, 'Error recieved on websocket'),
  complete: () => logger.debug('Connection on Websocket closed - general'),
};

const getProtocol = () => {
  if (__DEV__) {
    return 'ws';
  } else {
    return 'wss';
  }
};
