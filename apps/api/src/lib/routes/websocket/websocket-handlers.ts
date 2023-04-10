import { SocketStream } from '@fastify/websocket';
import logger from '@superlight/logger';
import {
  createMPCWebsocketHandlerWrapper,
  MPCWebscocketInit,
  MpcWebsocketHandlerWrapper,
  MPCWebsocketMessage,
} from '@superlight/mpc-common';
import { FastifyRequest } from 'fastify';
import { firstValueFrom, ReplaySubject, Subject, tap } from 'rxjs';
import { MPCWebsocketHandler, MPCWebsocketWithInitParameterHandler } from './websocket-types';

const wrapMPCWebsocketHandler: MpcWebsocketHandlerWrapper =
  createMPCWebsocketHandlerWrapper(logger);

// TODO: turns out EVERY mpc route has some sort of setup step that can fail.
// Therefore it would make sense to abstract it into the higher order handlers.
// Will do this at a later point cuz its non blocking and can be done at any point in time
export const websocketRoute = <T>(handler: MPCWebsocketHandler<T>) => {
  return (connection: SocketStream, req: FastifyRequest) => {
    logger.info('Websocket connection opened');

    const messages = new ReplaySubject<MPCWebsocketMessage>();

    // TODO Parse and verify
    connection.socket.on('message', message => messages.next(JSON.parse(message.toString())));
    connection.socket.on('error', error => messages.error(error));
    connection.socket.on('close', _ => messages.complete());
    connection.on('close', _ => messages.complete());

    const piped = messages.pipe(
      tap({
        next: message => logger.debug({ message }, 'Received message on websocket'),
        error: err => logger.error({ err }, 'Error recieved on websocket'),
        complete: () => logger.debug('Websocket closed'),
      })
    );

    wrapMPCWebsocketHandler(handler(req.user!, piped), connection.socket);
  };
};

export const websocketRouteWithInitParameter = <Result, InitParam = string>(
  handler: MPCWebsocketWithInitParameterHandler<Result, InitParam>
) => {
  return async (connection: SocketStream, req: FastifyRequest) => {
    logger.info('Websocket connection opened');
    const messages = new Subject<MPCWebsocketMessage>();

    // TODO Parse and verify
    connection.socket.on('message', message => messages.next(JSON.parse(message.toString())));
    connection.socket.on('error', error => messages.error(error));
    connection.socket.on('close', _ => messages.complete());
    connection.on('close', _ => messages.complete());

    const piped = messages.pipe(
      tap({
        next: message => logger.debug({ message }, 'Received message on websocket'),
        error: err => logger.error({ err }, 'Error recieved on websocket'),
        complete: () => logger.debug('Websocket closed'),
      })
    );

    const initParameter = (await firstValueFrom(piped)) as MPCWebscocketInit<InitParam>;

    connection.socket.send(JSON.stringify({ type: 'start' } as MPCWebsocketMessage));

    wrapMPCWebsocketHandler(handler(req.user!, piped, initParameter), connection.socket);
  };
};
