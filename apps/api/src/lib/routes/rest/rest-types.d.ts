type RouteResult<T> = ResultAsync<T, RouteError>;

type RouteHandler<T> = (req: FastifyRequest) => RouteResult<T>;
type AuthenticatedRouteHandler<T> = (req: FastifyRequest, user: User) => RouteResult<T>;
type NonceRouteHandler<T> = (req: FastifyRequest, nonce: string) => RouteResult<T>;
