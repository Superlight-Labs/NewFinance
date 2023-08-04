import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { WebsocketError } from './../error';

export type MPCWebsocketMessage<T = string> =
  | {
      type: 'inProgress';
      message: Uint8Array;
      compressed: true;
    }
  | {
      type: 'inProgress';
      message: string;
      compressed: false;
    }
  | { type: 'success'; result: T }
  | { type: 'start' }
  | MPCWebscocketInit;

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
