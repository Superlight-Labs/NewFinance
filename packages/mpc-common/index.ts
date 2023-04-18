import {
  createMPCWebsocketHandlerWrapper,
  shortenMessage,
} from './src/websocket/websocket-message-unwrap';
export { buildPath, indexToNumber } from './src/derive';
export type { DeriveConfig } from './src/derive';
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
export type { SignConfig } from './src/sign';
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
export type { SignResult } from './src/websocket/results';
export type {
  MPCWebscocketInit,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebSocketOutput,
} from './src/websocket/websocket-messages';
export { createMPCWebsocketHandlerWrapper, shortenMessage };
