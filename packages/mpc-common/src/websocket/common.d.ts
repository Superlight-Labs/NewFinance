import { ResultAsync } from 'neverthrow';
import { Observable } from 'rxjs';
import { WebsocketError } from '../error';
import { SignResult } from './results';
import { MPCWebsocketMessage } from './websocket-messages';

export type MpcWebsocketHandlerWrapper = <T>(
  handlerResult: Observable<ResultAsync<MPCWebsocketMessage<T>, WebsocketError>>,
  socket: any
) => void;

export type ApiConfig = { baseUrl: string; socketEndpoint: string };

export type WebsocketConfig = {
  apiConfig: ApiConfig;
  signResult: SignResult;
};
