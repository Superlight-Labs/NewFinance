import { Context } from '@crypto-mpc';
import { other } from '@lib/routes/rest/rest-error';
import logger from '@superlight-labs/logger';
import { shortenMessage } from '@superlight-labs/mpc-common';
import { createVerify } from 'crypto';
import { Result } from 'neverthrow';
import { User } from 'src/repository/user';
import { buildPubKey } from './auth';

type StepResult =
  | { type: 'error'; error?: unknown }
  | {
      type: 'success';
    }
  | {
      message: string;
      type: 'inProgress';
    };

export const verifySignature = (publicKey: string, message: string, signature: string): boolean => {
  const verifier = createVerify('SHA256').update(message, 'utf-8');

  return verifier.verify(
    {
      key: buildPubKey(publicKey),
      format: 'pem',
      type: 'pkcs1',
    },
    Buffer.from(signature, 'base64')
  );
};

export const step = (message: string, context: Context): StepResult => {
  logger.debug(
    { message: shortenMessage(message) },
    'Received message from client and stepping in context'
  );

  const inBuff = Buffer.from(message, 'base64');

  try {
    const outBuff = context.step(inBuff);

    if (context.isFinished()) {
      return { type: 'success' };
    }

    if (!outBuff) {
      return { type: 'error' };
    }

    return { type: 'inProgress', message: outBuff.toString('base64') };
  } catch (error) {
    return { type: 'error', error };
  }
};

export const getMpcContext = Result.fromThrowable(
  (user: User) => {
    if (!user.deriveContext) {
      throw new Error('User does not have a derive context');
    }

    return Context.fromBuffer(Buffer.from(user.deriveContext, 'base64'));
  },
  e => other('Error while creating mpc context object for user', e)
);
