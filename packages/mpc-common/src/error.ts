enum ErrorTypes {
  StepMessageError = 'StepMessageError',
  MpcInternalError = 'MpcInternalError',
  DatabaseError = 'DatabaseError',
  ApiError = 'ApiError',
  WebsocketError = 'WebsocketError',
}

interface HttpError {
  statusCode: number;
  errorMsg: string;
}

export interface AppError {
  message: string;
  error: unknown;
  level: 'error';
}

export type WebsocketError =
  | { type: ErrorTypes.MpcInternalError; context?: string; error?: unknown }
  | { type: ErrorTypes.StepMessageError; context?: string }
  | { type: ErrorTypes.WebsocketError; context?: string; error?: unknown }
  | { type: ErrorTypes.DatabaseError; context?: string; error?: unknown }
  | { type: ErrorTypes.ApiError; context?: string; error?: unknown };

export const isMPCWebsocketError = (error: any): error is WebsocketError => {
  return error.type && Object.values(ErrorTypes).includes(error.type);
};

export const mapWebsocketToApiError = (err: any): HttpError => {
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
      case 'WebsocketError': {
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

export const mapWebsocketToAppError = (err: unknown): AppError => {
  if (isMPCWebsocketError(err)) {
    switch (err.type) {
      case 'MpcInternalError': {
        return {
          level: 'error',
          message: 'Error while performing cryptographic operation',
          error: err.error,
        };
      }
      case 'StepMessageError': {
        return {
          level: 'error',
          message: err.context || 'Error while performing cryptographic operation',
          error: err,
        };
      }
      case 'WebsocketError': {
        return {
          level: 'error',
          message: err.context || 'Error while performing action with Websocket',
          error: err,
        };
      }
      case 'ApiError': {
        return {
          level: 'error',
          message: err.context || 'Error while communicating with API',
          error: err.error,
        };
      }
    }
  }

  return {
    level: 'error',
    message: 'Unexpected error, closing connection',
    error: err,
  };
};

export const mpcInternalError = (error?: unknown, context?: string): WebsocketError => ({
  type: ErrorTypes.MpcInternalError,
  context,
  error,
});

export const databaseError = (error: unknown, context?: string): WebsocketError => ({
  type: ErrorTypes.DatabaseError,
  context,
  error,
});

export const stepMessageError = (context?: string): WebsocketError => ({
  type: ErrorTypes.StepMessageError,
  context,
});

export const websocketError = (error: unknown, context?: string): WebsocketError => ({
  type: ErrorTypes.WebsocketError,
  error,
  context,
});

export const apiError = (error: unknown, context?: string): WebsocketError => ({
  type: ErrorTypes.ApiError,
  error,
  context,
});

export type MPCError = {
  message: string;
  error: unknown;
};
