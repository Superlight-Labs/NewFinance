import { Context } from '@crypto-mpc';
import logger from '@lib/logger';
import { Buffer } from 'buffer';

export const step = (message: string, context: Context): string | boolean => {
  const inBuff = Buffer.from(message, 'base64');

  try {
    const outBuff = context.step(inBuff);

    if (context.isFinished()) {
      logger.info('Steps for current actions are completed');
      return true;
    }

    if (!outBuff) {
      logger.info('out buff is not there, error must have occured');
      return false;
    }

    return outBuff.toString('base64');
  } catch (err) {
    logger.error({ err }, 'Error while performing step');
  }

  return false;
};
