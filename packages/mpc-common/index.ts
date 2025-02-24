import { shortenMessage } from './src/websocket/websocket-message-unwrap';
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
  mpcApiError as websocketError,
} from './src/error';
export type { AppError, WebsocketError } from './src/error';
export * from './src/schema';
export type { WebsocketConfig } from './src/websocket/common';
export type {
  HandlerParams,
  MPCWebsocketHandler,
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketStarter,
  MPCWebsocketStarterWithSetup,
  StarterWithSetupParams,
} from './src/websocket/handler';
export type { SignResult } from './src/websocket/results';
export type {
  MPCWebscocketInit,
  MPCWebsocketInProgress,
  MPCWebsocketMessage,
} from './src/websocket/websocket-messages';
export { shortenMessage };
