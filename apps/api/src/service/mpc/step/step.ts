import { Context } from '@crypto-mpc';

type StepResult =
  | {
      type: 'success' | 'error';
    }
  | {
      message: string;
      type: 'inProgress';
    };

export const step = (message: string, context: Context): StepResult => {
  const inBuff = Buffer.from(message, 'base64');

  const outBuff = context.step(inBuff);

  if (context.isFinished()) {
    return { type: 'success' };
  }

  if (!outBuff) {
    return { type: 'error' };
  }

  return { type: 'inProgress', message: outBuff.toString('base64') };
};
