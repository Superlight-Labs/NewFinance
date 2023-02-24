import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import { FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { RawData, WebSocket } from 'ws';
import { mapWebsocketError, WebsocketError } from './websocket-error';

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

const wrapMPCWebsocketHandler = <T>(
  handlerResult: MPCWebsocketResult<T>,
  socket: WebSocket
): void => {
  handlerResult.subscribe({
    next: val => {
      val
        .map(data => {
          logger.debug({ data }, 'Successfully sending data on websocket');
          socket.send(JSON.stringify(data));

          data.type === 'success' &&
            socket.close(1000, 'Successfully finished process with websocket');
        })
        .mapErr(error => {
          logger.error({ error }, 'Failed to work on request');
          const { statusCode, errorMsg } = mapWebsocketError(error);
          socket.close(statusCode, errorMsg);
        });
    },
    error: err => {
      logger.error({ err }, 'Failed to work on websocket request');
      const { statusCode, errorMsg } = mapWebsocketError(err);
      socket.close(statusCode, errorMsg);
    },
    complete: () => {
      logger.info('Completed process on websocket successfully');
      socket.close(1000, 'Websocket closed successfully');
    },
  });
};

export const websocketRoute = <T>(handler: MPCWebsocketHandler<T>) => {
  return (connection: SocketStream, req: FastifyRequest) => {
    const messages = new Subject<RawData>();

    connection.socket.on('message', messages.next);
    connection.socket.on('error', messages.error);

    wrapMPCWebsocketHandler(handler(req.user!, messages), connection.socket);
  };
};
