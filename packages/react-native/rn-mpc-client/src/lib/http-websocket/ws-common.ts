import logger from '@superlight-labs/logger';
import {
  AppError,
  MpcWebsocketHandlerWrapper,
  SignResult,
  WebsocketConfig,
  WebsocketError,
  apiError,
  createMPCWebsocketHandlerWrapper,
  mapWebsocketToAppError,
  other,
  websocketError,
} from '@superlight-labs/mpc-common';
import axios, { AxiosInstance } from 'axios';
import { Result, ResultAsync } from 'neverthrow';
import { Observable, firstValueFrom } from 'rxjs';

export type RawData = string | ArrayBufferLike | Blob | ArrayBufferView;
export type Signer = (nonce: string) => ResultAsync<SignResult, AppError>;

export const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(logger);

export type CreateWebsocketResult<T> = {
  startResult$: Observable<ResultAsync<T, WebsocketError>>;
  ws: WebSocket;
};

export const createNonce = (apiUrl: string): ResultAsync<string, AppError> => {
  return ResultAsync.fromPromise(axios.get<CreateNonceResponse>(`${apiUrl}/auth/get-nonce`), err =>
    mapWebsocketToAppError(apiError(err, 'Error while creating nonce'))
  ).map(res => res.data.nonce);
};

export type CreateNonceResponse = {
  nonce: string;
};

export const createRequestor = Result.fromThrowable(
  (config: WebsocketConfig) => {
    const { userId, devicePublicKey, signature } = config.signResult;
    const { baseUrl } = config;

    // TODO check if JWT makes sense here, this is a bit custom

    const backend = axios.create({
      baseURL: baseUrl,
      headers: {
        userid: userId,
        devicepublickey: devicePublicKey,
        signature,
      },
    });

    return backend;
  },
  err => websocketError(err, "Couldn't create websocket")
);

export const unwrapStartResult = <T>(
  startResult$: Observable<ResultAsync<T, WebsocketError>>,
  axios: AxiosInstance
) => {
  return ResultAsync.fromPromise(firstValueFrom(startResult$), err =>
    other(err, 'Error while unwrapping start result')
  ).map(startResult => ({ startResult, axios }));
};

export type ApiStepResult = {
  ok: boolean;
  peerShareId?: string;
  message?: string;
  signDone?: boolean;
};
