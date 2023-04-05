import { AppError, WebsocketError } from '../../error';

export type MPCWebsocketMessage<T = string> =
  | {
      type: 'inProgress';
      message: string;
    }
  | { type: 'success'; result: T };

export type MPCWebsocketResult<T = string> = Observable<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;

export type WebSocketStatus = 'inProgress' | 'start' | 'success' | 'error';
export type WebSocketOutput = Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>;

export type MpcWebsocketHandlerWrapper = <T>(
  handlerResult: Observable<ResultAsync<MPCWebsocketMessage<T>, WebsocketError>>,
  socket: any
) => void;

export type ApiConfig = { baseUrl: string; socketEndpoint: string };

export type SignResult = {
  userId: string;
  devicePublicKey: string;
  signature: string;
};

export type MPCWebsocketStarter<T = string> = (
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>
) => ResultAsync<string, WebsocketError>;

export type MPCWebsocketHandler<T> = (
  input: Observable<RawData>,
  share$: Observable<ResultAsync<string, WebsocketError>>,
  output: Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>
) => ResultAsync<T, AppError>;
