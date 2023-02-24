export type MPCWebsocketMessage<T = string> =
  | {
      type: 'inProgress';
      message: string;
    }
  | { type: 'success'; result: T };

export type MPCWebsocketResult<T = string> = Observable<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;
type MPCWebsocketHandler<T> = (user: User, message: Observable<RawData>) => MPCWebsocketResult<T>;
type MPCWebsocketWithInitParameterHandler<T> = (
  user: User,
  message: Observable<RawData>,
  initParameter: WSClientMessage
) => MPCWebsocketResult<T>;

export type WebSocketStatus = 'inProgress' | 'start' | 'success' | 'error';
export type WebSocketOutput = Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>;
