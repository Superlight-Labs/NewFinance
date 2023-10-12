import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { WebsocketError } from './../error';

export type MPCWebsocketMessage<T = string> =
  | MPCWebsocketInProgress
  | { type: 'success'; result: T }
  | { type: 'start' }
  | MPCWebscocketInit;

export type MPCWebsocketInProgress = {
  type: 'inProgress';
  message: string;
};

export type MPCWebscocketInit<T = string> = {
  type: 'init';
  parameter: T;
};

export type MPCWebsocketResult<T = string> = Observable<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;

export type WebSocketOutput<T = string> = Subject<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;
