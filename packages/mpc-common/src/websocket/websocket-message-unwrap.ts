import { ResultAsync } from 'neverthrow';
import { WebSocket } from 'ws';
import { WebsocketError, mapWebsocketToApiError } from '../error';
import { MPCWebsocketMessage, MPCWebsocketResult, MpcWebsocketHandlerWrapper } from './types';

export const createMPCWebsocketHandlerWrapper =
  (logger: Logger): MpcWebsocketHandlerWrapper =>
  <T>(handlerResult: MPCWebsocketResult<T>, socket: WebSocket): void => {
    handlerResult.subscribe({
      next: (val: ResultAsync<MPCWebsocketMessage<T>, WebsocketError>) => {
        val.match(
          data => {
            logger.debug({ data }, 'Successfully sending data on websocket');
            socket.send(JSON.stringify(data));

            data.type === 'success' &&
              socket.close(1000, 'Successfully finished process with websocket');
          },
          error => {
            logger.error({ error }, 'Failed to work on request');
            const { statusCode, errorMsg } = mapWebsocketToApiError(error);
            socket.close(statusCode, errorMsg);
          }
        );
      },
      error: (err: WebsocketError) => {
        logger.error({ err }, 'Failed to work on websocket request');
        const { statusCode, errorMsg } = mapWebsocketToApiError(err);
        socket.close(statusCode, errorMsg);
      },
      complete: () => {
        logger.info('Completed process on websocket successfully');
        socket.close(1000, 'Websocket closed successfully');
      },
    });
  };

type Logger = {
  info: (...args: any) => void;
  error: (...args: any) => void;
  warn: (...args: any) => void;
  debug: (...args: any) => void;
};
