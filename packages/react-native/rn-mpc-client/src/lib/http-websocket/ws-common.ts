import {
  AppError,
  SignResult,
  WebsocketConfig,
  apiError,
  mapWebsocketToAppError,
  websocketError,
} from '@superlight-labs/mpc-common';
import axios from 'axios';
import { Result, ResultAsync } from 'neverthrow';

export type RawData = string | ArrayBufferLike | Blob | ArrayBufferView;
export type Signer = (nonce: string) => ResultAsync<SignResult, AppError>;

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

export type ApiStepResult = {
  ok: boolean;
  peerShareId?: string;
  message?: string;
  signDone?: boolean;
};
