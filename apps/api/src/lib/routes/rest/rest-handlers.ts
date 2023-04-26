import { invalidAuthRequest, mapRouteError } from '@lib/routes/rest/rest-error';
import { authenticate, isNonceValid } from '@lib/utils/auth';
import logger from '@superlight-labs/logger';
import { shortenMessage } from '@superlight-labs/mpc-common';
import crypto from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AuthenticatedRouteHandler,
  NonceRouteHandler,
  RouteHandler,
  RouteResult,
} from './rest-types';

const wrapHandler = <T>(handlerResult: RouteResult<T>, res: FastifyReply): void => {
  handlerResult.match(
    data => {
      logger.debug({ message: shortenMessage(data) }, 'Successfully sending data');
      res.status(200).send(data);
    },
    error => {
      logger.error({ error }, 'Failed to work on request');
      const { statusCode, errorMsg } = mapRouteError(error);
      res.status(statusCode).send({ error: errorMsg });
    }
  );
};

export const route = <T>(handler: RouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    // const sessionMgr = new SessionManager(req);

    wrapHandler(handler(req), res);
  };
};

export const nonceRoute = <T>(handler: NonceRouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    const signedNonce = req.cookies['authnonce'];

    const nonce = req.unsignCookie(signedNonce || '').value || '';

    if (!isNonceValid(nonce)) {
      wrapHandler(invalidAuthRequest, res);
      return;
    }

    wrapHandler(handler(req, nonce), res);
  };
};

type NonceOptions = {
  nonceLength: number;
  cookieName: string;
};

export const setNonceRoute = <T>(handler: NonceRouteHandler<T>, options?: NonceOptions) => {
  const { nonceLength = 16, cookieName = 'authnonce' } = options || {};
  return (req: FastifyRequest, res: FastifyReply) => {
    const nonce = crypto.randomBytes(nonceLength).toString('base64');

    res.setCookie(cookieName, nonce, {
      signed: true,
      path: '/',
      httpOnly: true,
    });

    wrapHandler(handler(req, nonce), res);
  };
};

export const authenticatedRoute = <T>(handler: AuthenticatedRouteHandler<T>) => {
  return (req: FastifyRequest, res: FastifyReply) => {
    const authResult = authenticate(req);

    wrapHandler(
      authResult.andThen(user => handler(req, user)),
      res
    );
  };
};
