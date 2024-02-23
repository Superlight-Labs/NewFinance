import {
  createMPCWebsocketHandlerWrapper,
  shortenMessage,
} from './src/websocket/websocket-message-unwrap';
export * from 'src/schema';
export { buildPath, indexToNumber } from './src/actions';
export {
  apiError,
  appError,
  bitcoinJsError,
  databaseError,
  mapWebsocketToApiError as mapWebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
  other,
  stepMessageError,
  websocketError,
} from './src/error';
export type { AppError, WebsocketError } from './src/error';
export { deriveFromSchema, importHexSchema, signWithShareSchema } from './src/schema';
export type { DeriveFrom, ImportHexSchema, SignWithShare } from './src/schema';
export type {
  ApiConfig,
  MpcWebsocketHandlerWrapper,
  WebsocketConfig,
} from './src/websocket/common';
export type {
  HandlerParams,
  HandlerWithSetupParams,
  MPCWebsocketHandler,
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketStarter,
  MPCWebsocketStarterWithSetup,
  StarterWithSetupParams,
} from './src/websocket/handler';
export { HttpWebsocket, HttpWebsocketClient } from './src/websocket/http-websocket/client';
export type { SignResult } from './src/websocket/results';
export type {
  MPCWebscocketInit,
  MPCWebsocketInProgress,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
} from './src/websocket/websocket-messages';
export { createMPCWebsocketHandlerWrapper, shortenMessage };
