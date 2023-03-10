import crypto from 'crypto';
import { buildPubKey } from './auth';

export const verifySignature = (publicKey: string, message: string, signature: string): boolean => {
  const verifier = crypto.createVerify('SHA256').update(message, 'utf-8');

  return verifier.verify(
    {
      key: buildPubKey(publicKey),
      format: 'pem',
      type: 'pkcs1',
    },
    Buffer.from(signature, 'base64')
  );
};

export const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === 'm') return 'm';

  return `${parentPath}/${index}${hardened === '1' ? "'" : ''}`;
};

export type DeriveConfig = {
  serverShareId: string;
  index: string;
  hardened: string;
  parentPath: string;
};

import { Context } from '@crypto-mpc';

type StepResult =
  | { type: 'error'; error?: unknown }
  | {
      type: 'success';
    }
  | {
      message: string;
      type: 'inProgress';
    };

export const step = (message: string, context: Context): StepResult => {
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
