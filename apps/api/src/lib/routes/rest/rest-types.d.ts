import { Context } from '@crypto-mpc';
import { WebsocketError } from '@superlight-labs/mpc-common';
import { FastifyRequest, RouteGenericInterface } from 'fastify';
import { ResultAsync } from 'neverthrow';
import { User } from 'src/repository/user';
import { RouteError } from './rest-error';

type MpcContextResult = {
  user: User;
  context?: Context;
  message?: string;
  peerShareId?: string;
};

type RouteResult<T> = ResultAsync<T, RouteError | WebsocketError>;
type RouteHandler<T> = (req: FastifyRequest) => RouteResult<T>;

type AuthenticatedRouteHandler<T> = (req: FastifyRequest, user: User) => RouteResult<T>;
type NonceRouteHandler<T> = (req: FastifyRequest, nonce: string) => RouteResult<T>;

type MPCRouteResult = ResultAsync<MpcContextResult, RouteError | WebsocketError>;
type MPCRouteHandler<T extends RouteGenericInterface> = (
  req: FastifyRequest<T>,
  user: User
) => MPCRouteResult;
