import { WebsocketError, mapWebsocketToApiError } from '@superlight-labs/mpc-common/src/error';
import { ResultAsync } from 'neverthrow';
import { HttpError } from '../types';

export const mapRouteError = (err: RouteError | WebsocketError): HttpError => {
  switch (err.type) {
    case 'InvalidAuthentication': {
      return {
        statusCode: 401,
        errorMsg: err.context || 'Invalid Authentication',
      };
    }

    case 'MissingHeader': {
      return {
        statusCode: 400,
        errorMsg: 'Missing `Authorization` header',
      };
    }

    case 'InvalidSession': {
      return {
        statusCode: 401,
        errorMsg: 'Invalid Session',
      };
    }

    case 'BadRequest': {
      return {
        statusCode: 400,
        errorMsg: err.context,
      };
    }

    case 'Conflict': {
      return {
        statusCode: 409,
        errorMsg: err.context,
      };
    }

    case 'NotFound': {
      const withMaybeContext = err.context ? ` - ${err.context}` : '';

      return {
        statusCode: 404,
        errorMsg: `Not Found${withMaybeContext}`,
      };
    }

    case 'ThirdPartyError': {
      return {
        statusCode: 503,
        errorMsg: err.context || 'Our Partners are not reachable',
      };
    }

    case 'Other': {
      return {
        statusCode: 500,
        errorMsg: err.context || 'An Internal Error Occurred :(',
      };
    }

    default: {
      return mapWebsocketToApiError(err);
    }
  }
};

enum ErrorTypes {
  NotFound = 'NotFound',
  Conflict = 'Conflict',
  Other = 'Other',
  MissingHeader = 'MissingHeader',
  InvalidAuthentication = 'InvalidAuthentication',
  InvalidSession = 'InvalidSession',
  BadRequest = 'BadRequest',
  ThirdPartyError = 'ThirdPartyError',
}

export type RouteError =
  | { type: ErrorTypes.NotFound; context?: string }
  | { type: ErrorTypes.Conflict; context: string; error: unknown }
  | { type: ErrorTypes.Other; error?: unknown; context?: string }
  | { type: ErrorTypes.ThirdPartyError; error?: unknown; context?: string }
  | { type: ErrorTypes.MissingHeader }
  | { type: ErrorTypes.InvalidAuthentication; context?: string }
  | { type: ErrorTypes.InvalidSession }
  | { type: ErrorTypes.BadRequest; context: string };

export const isRouteError = (error: any): error is RouteError => {
  return error.type && Object.values(ErrorTypes).includes(error.type);
};

export const notFound = (context?: string): RouteError => ({
  type: ErrorTypes.NotFound,
  context,
});

export const conflict = (error: unknown, context: string): RouteError => ({
  type: ErrorTypes.Conflict,
  context,
  error,
});

export const other = (context: string, error?: unknown): RouteError => ({
  type: ErrorTypes.Other,
  context,
  error,
});

export const missingHeader = (): RouteError => ({
  type: ErrorTypes.MissingHeader,
});

export const invalidAuthentication = (context?: string): RouteError => ({
  type: ErrorTypes.InvalidAuthentication,
  context,
});

export const invalidSession = (): RouteError => ({
  type: ErrorTypes.InvalidSession,
});

export const badRequest = (context: string): RouteError => ({
  type: ErrorTypes.BadRequest,
  context,
});

export const thirdPartyError = (context: string, error?: unknown) => ({
  type: ErrorTypes.ThirdPartyError,
  context,
  error,
});

export const invalidAuthRequest = ResultAsync.fromPromise(Promise.reject(), _ =>
  badRequest('Invalid Request on Private Endpoint')
);
