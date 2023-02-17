import { ResultAsync } from 'neverthrow';
import logger from './logger';

interface HttpError {
  statusCode: number;
  errorMsg: string;
}

export const mapRouteError = (err: RouteError): HttpError => {
  switch (err.type) {
    case 'InvalidToken': {
      return {
        statusCode: 400,
        errorMsg: 'Invalid Token Format',
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
        errorMsg: 'Conflict',
      };
    }

    case 'NotFound': {
      const withMaybeContext = err.context ? ` - ${err.context}` : '';

      return {
        statusCode: 404,
        errorMsg: `Not Found${withMaybeContext}`,
      };
    }

    case 'Other': {
      const errorInfo = [err.error ? err.error : '', `Context: ${err.context}`]
        .filter((val) => val !== '')
        .join('\n');

      logger.error(errorInfo);

      return {
        statusCode: 500,
        errorMsg: 'An Internal Error Occurred :(',
      };
    }
  }
};

export type RouteError =
  | { type: 'NotFound'; context?: string }
  | { type: 'Conflict'; context?: string }
  | { type: 'Other'; error?: Error; context?: string }
  | { type: 'MissingHeader' }
  | { type: 'InvalidToken' }
  | { type: 'InvalidSession' }
  | { type: 'BadRequest'; context: string };

export const notFound = (context?: string): RouteError => ({
  type: 'NotFound',
  context,
});

export const conflict = (context?: string): RouteError => ({
  type: 'Conflict',
  context,
});

export const other = (context: string, error?: Error): RouteError => ({
  type: 'Other',
  context,
  error,
});

export const missingHeader = (): RouteError => ({
  type: 'MissingHeader',
});

export const invalidToken = (): RouteError => ({
  type: 'InvalidToken',
});

export const invalidSession = (): RouteError => ({
  type: 'InvalidSession',
});

export const badRequest = (context: string): RouteError => ({
  type: 'BadRequest',
  context,
});

export const invalidAuthRequest = ResultAsync.fromPromise(
  Promise.reject(),
  (_) => badRequest('Invalid Request on Private Endpoint')
);
