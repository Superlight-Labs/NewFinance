import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { AppError, WebsocketError } from 'src/error';
import { MPCWebsocketMessage } from './websocket-messages';

export type MPCWebsocketStarter<T> = (ws: WebSocket) => ResultAsync<T, WebsocketError>;

export type MPCWebsocketStarterWithSetup<InitParam, StartRes> = (
  params: StarterWithSetupParams<InitParam>
) => ResultAsync<HandlerWithSetupParams<StartRes>, WebsocketError>;

export type MPCWebsocketHandlerWithSetup<Result, StartRes> = (
  params: HandlerWithSetupParams<StartRes>
) => ResultAsync<Result, WebsocketError>;

export type StarterWithSetupParams<InitParam> = {
  input: Observable<MPCWebsocketMessage>;
  output: Subject<ResultAsync<MPCWebsocketMessage<U>, WebsocketError>>;
  initParam: InitParam;
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
