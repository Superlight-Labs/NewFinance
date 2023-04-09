import { createMPCWebsocketHandlerWrapper } from './src/websocket/websocket-message-unwrap';
export {
  apiError,
  databaseError,
  mapWebsocketToApiError as mapWebsocketError,
  mapWebsocketToAppError,
  mpcInternalError,
  other,
  stepMessageError,
  websocketError,
} from './src/error';
export type { AppError, WebsocketError } from './src/error';
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
export { createMPCWebsocketHandlerWrapper };
