import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { AppError, WebsocketError } from 'src/error';
import { MPCWebsocketMessage } from './websocket-messages';

export type MPCWebsocketStarter<T> = (ws: WebSocket) => ResultAsync<T, WebsocketError>;

export type MPCWebsocketStarterWithSetup<Init, StartRes> = (
  params: StarterWithSetupParams<Init>
) => ResultAsync<HandlerWithSetupParams<StartRes>, WebsocketError>;

export type MPCWebsocketHandlerWithSetup<T, U> = (
  params: HandlerWithSetupParams<U>
) => ResultAsync<T, WebsocketError>;

export type StarterWithSetupParams<T> = {
  input: Observable<MPCWebsocketMessage>;
  output: Subject<ResultAsync<MPCWebsocketMessage<U>, WebsocketError>>;
  initParam: T;
};

export type HandlerWithSetupParams<T> = {
  input: Observable<MPCWebsocketMessage>;
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>;
  startResult: ResultAsync<T, WebsocketError>;
};

export type MPCWebsocketHandler<T, U> = (params: HandlerParams<U>) => ResultAsync<T, AppError>;

export type HandlerParams<U> = {
  input: Observable<MPCWebsocketMessage>;
  startResult: ResultAsync<U, WebsocketError>;
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>;
};
