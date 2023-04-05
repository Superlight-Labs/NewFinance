import {
  MPCWebsocketHandler,
  MPCWebsocketMessage,
  MpcWebsocketHandlerWrapper,
  WebsocketError,
  createMPCWebsocketHandlerWrapper,
  mapWebsocketToAppError,
} from '@superlight/mpc-common';
import { AppError, apiError } from '@superlight/mpc-common/src/error';
import { ApiConfig, SignResult } from '@superlight/mpc-common/src/websocket/types';
import axios from 'axios';
import { ResultAsync } from 'neverthrow';
import { Subject } from 'rxjs';
import WebSocket, { RawData } from 'ws';

const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(console);

export type Signer = (nonce: string) => ResultAsync<SignResult, AppError>;

export const authWebsocket =
  (apiConfig: ApiConfig, sign: Signer) =>
  <T>(handler: MPCWebsocketHandler<T>): ResultAsync<T, AppError> => {
    return createNonce(apiConfig.baseUrl)
      .andThen(sign)
      .andThen(signature => startWebsocket<T>(signature, apiConfig, handler));
  };

const startWebsocket = <T>(
  { userId, devicePublicKey, deviceSignature }: SignResult,
  { baseUrl, socketEndpoint }: ApiConfig,
  handler: MPCWebsocketHandler<T>
): ResultAsync<T, AppError> => {
  // TODO check if JWT makes sense here, this is a bit custom
  const ws = new WebSocket(`ws://${baseUrl}/mpc/ecdsa/${socketEndpoint}`, {
    headers: {
      userId,
      devicePublicKey,
      deviceSignature,
    },
  });

  const input = new Subject<RawData>();
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  ws.on('message', input.next);
  ws.on('error', input.error);
  ws.on('close', input.complete);

  wrapMPCWebsocketHandler(output, ws);

  return handler(input, output);
};

const createNonce = (apiUrl: string): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(axios.get<string>(`http://${apiUrl}/auth/get-nonce`), err =>
    mapWebsocketToAppError(apiError('Error while creating nonce'))
  ).map(res => res.data);
};
