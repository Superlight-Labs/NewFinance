import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import { FastifyRequest } from 'fastify';
import { firstValueFrom, skip, Subject } from 'rxjs';
import { RawData, WebSocket } from 'ws';
import { mapWebsocketError } from './websocket-error';
import {
  MPCWebsocketHandler,
  MPCWebsocketResult,
  MPCWebsocketWithInitParameterHandler,
} from './websocket-types';

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
    connection.socket.on('close', messages.complete);
    connection.on('close', messages.complete);

    wrapMPCWebsocketHandler(handler(req.user!, messages), connection.socket);
  };
};

export const websocketRouteWithInitParameter = <T>(
  handler: MPCWebsocketWithInitParameterHandler<T>
) => {
  return async (connection: SocketStream, req: FastifyRequest) => {
    const messages = new Subject<RawData>();

    connection.socket.on('message', messages.next);
    connection.socket.on('error', messages.error);
    connection.socket.on('close', messages.complete);
    connection.on('close', messages.complete);

    const initParameter = await firstValueFrom(messages);
    connection.socket.send(JSON.stringify({ type: 'start' }));

    wrapMPCWebsocketHandler(
      handler(req.user!, messages.pipe(skip(1)), initParameter),
      connection.socket
    );
  };
};
