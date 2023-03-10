import { HttpError } from '../types';

enum ErrorTypes {
  StepMessageError = 'StepMessageError',
  MpcInternalError = 'MpcInternalError',
  DatabaseError = 'DatabaseError',
}

export type WebsocketError =
  | { type: ErrorTypes.MpcInternalError; error?: unknown }
  | { type: ErrorTypes.StepMessageError; context?: string }
  | { type: ErrorTypes.DatabaseError; context?: string; error?: unknown };

export const isMPCWebsocketError = (error: any): error is WebsocketError => {
  return error.type && Object.values(ErrorTypes).includes(error.type);
};

export const mapWebsocketError = (err: any): HttpError => {
  if (isMPCWebsocketError(err)) {
    switch (err.type) {
      case 'MpcInternalError': {
        return {
          statusCode: 1011,
          errorMsg: 'Error while performing cryptographic operation',
        };
      }
      case 'StepMessageError': {
        return {
          statusCode: 1011,
          errorMsg: err.context || 'Error while performing cryptographic operation',
        };
      }
      case 'DatabaseError': {
        return {
          statusCode: 1011,
          errorMsg: err.context || 'Error while performing cryptographic operation',
        };
      }
    }
  }

  return {
    statusCode: 1011,
    errorMsg: 'Unexpected error, closing connection',
  };
};

export const mpcInternalError = (error?: unknown): WebsocketError => ({
  type: ErrorTypes.MpcInternalError,
  error,
});

export const databaseError = (error: unknown, context?: string): WebsocketError => ({
  type: ErrorTypes.DatabaseError,
  context,
  error,
});

export const stepMessageError = (context?: string): WebsocketError => ({
  type: ErrorTypes.DatabaseError,
  context,
});
