import { Context } from '@crypto-mpc';
import { WebsocketError, indexToNumber, mpcInternalError } from '@superlight/mpc-common';
import { Result, fromThrowable } from 'neverthrow';
import { RawData } from 'ws';

export const createEcdsaSignContext = (
  keyShare: string,
  message: string,
  encoding: BufferEncoding
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createEcdsaSignContext, err =>
    mpcInternalError(err, 'Error while creating sign context')
  );

  return createContext(2, Buffer.from(keyShare, 'base64'), Buffer.from(message, encoding), true);
};

export const createGenerateGenericSecretContext = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createGenerateGenericSecretContext, err =>
    mpcInternalError(err, 'Error while creating generic secret context')
  );

  return createContext(2, 256);
};

export const createGenerateEcdsaKey = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createGenerateEcdsaKey, err =>
    mpcInternalError(err, 'Error while creating keygen context')
  );

  return createContext(2);
};

export const createImportGenericSecretContext = (
  secret: RawData
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createImportGenericSecretContext, err =>
    mpcInternalError(err, 'Error while creating import generic secret context')
  );

  return createContext(2, 256, secret);
};

export const createDeriveBIP32Context = (
  parentKeyShare: string,
  hardened: boolean,
  index: string
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(Context.createDeriveBIP32Context, err =>
    mpcInternalError(err, 'Error while creating derive BIP32 context')
  );

  return createContext(2, Buffer.from(parentKeyShare, 'base64'), hardened, indexToNumber(index));
};

export const getResultDeriveBIP32 = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getResultDeriveBIP32, err =>
    mpcInternalError(err, 'Error while getting result bip 32')
  );

  return getResult().map(share => share.toBuffer().toString('base64'));
};

export const getResultSign = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getResultDeriveBIP32, err =>
    mpcInternalError(err, 'Error while getting result sign')
  );

  return getResult().map(share => share.toBuffer().toString('base64'));
};

export const getNewShare = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(context.getNewShare, err =>
    mpcInternalError(err, 'Error while getting new share')
  );

  return getResult().map(res => res.toString('base64'));
};
