import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import {
  createMPCWebsocketHandlerWrapper,
  MpcWebsocketHandlerWrapper,
} from '@superlight/mpc-common';
import { FastifyRequest } from 'fastify';
import { firstValueFrom, skip, Subject } from 'rxjs';
import { RawData } from 'ws';
import { MPCWebsocketHandler, MPCWebsocketWithInitParameterHandler } from './websocket-types';

const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(logger);

// TODO: turns out EVERY mpc route has some sort of setup step that can fail.
// Therefore it would make sense to abstract it into the higher order handlers.
// Will do this at a later point cuz its non blocking and can be done at any point in time
export const websocketRoute = <T>(handler: MPCWebsocketHandler<T>) => {
  return (connection: SocketStream, req: FastifyRequest) => {
    const messages = new Subject<RawData>();

    connection.socket.on('message', message => messages.next(message));
    connection.socket.on('error', error => messages.error(error));
    connection.socket.on('close', _ => messages.complete());
    connection.on('close', _ => messages.complete());

    wrapMPCWebsocketHandler(handler(req.user!, messages), connection.socket);
  };
};

export const websocketRouteWithInitParameter = <T>(
  handler: MPCWebsocketWithInitParameterHandler<T>
) => {
  return async (connection: SocketStream, req: FastifyRequest) => {
    const messages = new Subject<RawData>();

    connection.socket.on('message', message => messages.next(message));
    connection.socket.on('error', error => messages.error(error));
    connection.socket.on('close', _ => messages.complete());
    connection.on('close', _ => messages.complete());

    const initParameter = await firstValueFrom(messages);
    connection.socket.send(JSON.stringify({ type: 'start' }));

    wrapMPCWebsocketHandler(
      handler(req.user!, messages.pipe(skip(1)), initParameter),
      connection.socket
    );
  };
};
