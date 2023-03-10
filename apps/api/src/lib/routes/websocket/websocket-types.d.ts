import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { RawData } from 'ws';
import { WebsocketError } from './websocket-error';

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
  initParameter: RawData
) => MPCWebsocketResult<T>;

export type WebSocketStatus = 'inProgress' | 'start' | 'success' | 'error';
export type WebSocketOutput = Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>;
