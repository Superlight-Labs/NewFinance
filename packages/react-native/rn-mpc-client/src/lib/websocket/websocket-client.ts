import {
  MPCWebsocketHandler,
  MpcWebsocketHandlerWrapper,
  WebsocketError,
  createMPCWebsocketHandlerWrapper,
  mapWebsocketToAppError,
} from '@superlight/mpc-common';
import { AppError, apiError, websocketError } from '@superlight/mpc-common/src/error';
import {
  ApiConfig,
  MPCWebsocketMessage,
  MPCWebsocketStarter,
  SignResult,
} from '@superlight/mpc-common/src/websocket/types';
import axios from 'axios';
import { Result, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';

export type RawData = string | ArrayBufferLike | Blob | ArrayBufferView;

const myCons = console;

myCons.debug = console.log;
myCons.error = console.log;
myCons.info = console.log;

const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(myCons);

export type Signer = (nonce: string) => ResultAsync<SignResult, AppError>;

export const authWebsocket =
  (apiConfig: ApiConfig, sign: Signer) =>
  <T>(starter: MPCWebsocketStarter, handler: MPCWebsocketHandler<T>): ResultAsync<T, AppError> => {
    return createNonce(apiConfig.baseUrl)
      .andThen(sign)
      .andThen(signature => createWebsocket(starter, signature, apiConfig))
      .andThen(({ share$, ws }) => listenToWebsocket(handler, share$, ws));
  };

const createWebsocket = (
  starter: MPCWebsocketStarter,
  { userId, devicePublicKey, signature }: SignResult,
  { baseUrl, socketEndpoint }: ApiConfig
): Result<CreateWebsocketResult, AppError> => {
  const share$ = new Subject<ResultAsync<string, WebsocketError>>();

  // TODO check if JWT makes sense here, this is a bit custom
  const create = Result.fromThrowable(
    () =>
      new WebSocket(`ws://${baseUrl}/mpc/ecdsa/${socketEndpoint}`, undefined, {
        headers: {
          userid: userId,
          devicepublickey: devicePublicKey,
          signature,
        },
      }),
    err => mapWebsocketToAppError(websocketError(err, "Couldn't create websocket"))
  );

  return create().map(ws => {
    ws.onopen = () => share$.next(starter(ws));

    return { share$, ws };
  });
};

type CreateWebsocketResult = {
  share$: Observable<ResultAsync<string, WebsocketError>>;
  ws: WebSocket;
};

const listenToWebsocket = <T>(
  handler: MPCWebsocketHandler<T>,
  share$: Observable<ResultAsync<string, WebsocketError>>,
  ws: WebSocket
): ResultAsync<T, AppError> => {
  const input = new Subject<RawData>();
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  ws.onmessage = ({ data }) => input.next(data);
  ws.onerror = err => input.error(err);
  ws.onclose = _ => input.complete();

  wrapMPCWebsocketHandler(output, ws);

  return handler(input, share$, output);
};

const createNonce = (apiUrl: string): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(
    axios.get<CreateNonceResponse>(`http://${apiUrl}/auth/get-nonce`),
    err => mapWebsocketToAppError(apiError(err, 'Error while creating nonce'))
  ).map(res => res.data.nonce);
};

type CreateNonceResponse = {
  nonce: string;
};
