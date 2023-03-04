import { Context } from '@crypto-mpc';
import { mpcInternalError, WebsocketError } from '@lib/routes/websocket/websocket-error';
import { fromThrowable, Result } from 'neverthrow';
import { RawData } from 'ws';

export const createEcdsaSignContext = (
  keyShare: string,
  message: string,
  encoding: BufferEncoding
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createEcdsaSignContext, err => mpcInternalError(err));

  return createContext(2, Buffer.from(keyShare, 'base64'), Buffer.from(message, encoding), true);
};

export const createGenerateGenericSecretContext = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createGenerateGenericSecretContext, err =>
    mpcInternalError(err)
  );

  return createContext(2, 256);
};

export const createGenerateEcdsaKey = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createGenerateEcdsaKey, err => mpcInternalError(err));

  return createContext(2);
};

export const createImportGenericSecretContext = (
  secret: RawData
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createImportGenericSecretContext, err =>
    mpcInternalError(err)
  );

  return createContext(2, 256, secret);
};

export const createDeriveBIP32Context = (
  parentKeyShare: string,
  hardened: boolean,
  index: string
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createDeriveBIP32Context, err =>
    mpcInternalError(err)
  );

  return createContext(2, Buffer.from(parentKeyShare, 'base64'), hardened, Number(index));
};

export const getResultBIP32 = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getResultDeriveBIP32, err => mpcInternalError(err));

  return getResult().map(share => share.toBuffer().toString('base64'));
};

export const getResultSign = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getResultDeriveBIP32, err => mpcInternalError(err));

  return getResult().map(share => share.toBuffer().toString('base64'));
};

export const getNewShare = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getNewShare, err => mpcInternalError(err));

  return getResult().map(res => res.toString('base64'));
};
