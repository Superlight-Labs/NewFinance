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
