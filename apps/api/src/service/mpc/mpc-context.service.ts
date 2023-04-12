import { Context } from '@crypto-mpc';
import { WebsocketError, indexToNumber, mpcInternalError } from '@superlight/mpc-common';
import { Result, fromThrowable } from 'neverthrow';
import { RawData } from 'ws';

export const createEcdsaSignContext = (
  keyShare: string,
  message: string,
  encoding: BufferEncoding
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(
    () =>
      Context.createEcdsaSignContext(
        2,
        Buffer.from(keyShare, 'base64'),
        Buffer.from(message, encoding),
        true
      ),
    err => mpcInternalError(err, 'Error while creating sign context')
  );

  return createContext();
};

export const createGenerateGenericSecretContext = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(
    () => Context.createGenerateGenericSecretContext(2, 256),
    err => mpcInternalError(err, 'Error while creating generic secret context')
  );

  return createContext();
};

export const createGenerateEcdsaKey = (): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(
    () => Context.createGenerateEcdsaKey(2),
    err => mpcInternalError(err, 'Error while creating keygen context')
  );

  return createContext();
};

export const createImportGenericSecretContext = (
  secret: RawData
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(
    () => Context.createImportGenericSecretContext(2, 256, secret),
    err => mpcInternalError(err, 'Error while creating import generic secret context')
  );

  return createContext();
};

export const createDeriveBIP32Context = (
  parentKeyShare: string,
  hardened: boolean,
  index: string
): Result<Context, WebsocketError> => {
  const createContext = fromThrowable(
    () =>
      Context.createDeriveBIP32Context(
        2,
        Buffer.from(parentKeyShare, 'base64'),
        hardened,
        indexToNumber(index)
      ),
    err => mpcInternalError(err, 'Error while creating derive BIP32 context')
  );

  return createContext();
};

export const getResultDeriveBIP32 = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(
    () => context.getResultDeriveBIP32(),
    err => mpcInternalError(err, 'Error while getting result bip 32')
  );

  return getResult().map(share => share.toBuffer().toString('base64'));
};

export const getResultSign = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(
    () => context.getResultEcdsaSign(),
    err => mpcInternalError(err, 'Error while getting result sign')
  );

  return getResult().map(share => share.toString('base64'));
};

export const getNewShare = (context: Context): Result<string, WebsocketError> => {
  const getResult = fromThrowable(
    () => context.getNewShare(),
    err => mpcInternalError(err, 'Error while getting new share')
  );

  return getResult().map(res => res.toString('base64'));
};
