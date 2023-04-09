import { FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';
import { User } from 'src/repository/user';
import { RouteError } from './rest-error';

type RouteResult<T> = ResultAsync<T, RouteError>;

type RouteHandler<T> = (req: FastifyRequest) => RouteResult<T>;
type AuthenticatedRouteHandler<T> = (req: FastifyRequest, user: User) => RouteResult<T>;
type NonceRouteHandler<T> = (req: FastifyRequest, nonce: string) => RouteResult<T>;
