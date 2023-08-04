import { Context } from '@crypto-mpc';
import { Decoder, Encoder, decode } from '@msgpack/msgpack';
import logger from '@superlight-labs/logger';
import { MPCWebsocketMessage } from '@superlight-labs/mpc-common';
import { createVerify } from 'crypto';
import { encode } from 'msgpack-lite';
import { buildPubKey } from './auth';

type StepResult =
  | { type: 'error'; error?: unknown }
  | {
      type: 'success';
    }
  | {
      message: Uint8Array;
      compressed: true;
      type: 'inProgress';
    }
  | {
      message: string;
      compressed: false;
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

export const step = (message: MPCWebsocketMessage, context: Context): StepResult => {
  if (message.type !== 'inProgress') return { type: 'error', error: 'Invalid message type' };

  const stepIn = message.compressed ? (decode(message.message) as string) : message.message;

  logger.debug(
    { lolo: stepIn.slice(stepIn.length - 10, stepIn.length), compressed: message.compressed },
    'Received message from client and stepping in context'
  );

  try {
    const outBuff = context.step(Buffer.from(stepIn, 'base64'));
    logger.info({ isbuf: outBuff?.length }, '1');

    if (context.isFinished()) {
      return { type: 'success' };
    }

    if (!outBuff) {
      return { type: 'error' };
    }

    const enc = encode(buffToArr(outBuff));
    logger.info({ encLen: enc.length }, 'encoded');

    const enc2 = encode(new Uint8Array(outBuff));
    logger.info({ isbuf: enc2.length }, 'u8');

    if (outBuff.length < 10000) {
      logger.info({ outBuffType: typeof outBuff, what: Buffer.isBuffer(outBuff), outBuff }, '2');
    }

    if (outBuff.length > 10000000) {
      logger.info({ len: outBuff.length }, '2');
      //   logger.info({ outBuff: typeof outBuff, what: ArrayBuffer.isView(outBuff) }, '2');
      try {
        const encoder = new Encoder();
        const decoder = new Decoder();

        // const result = decoder.decode(enc);

        //     return {
        //       type: 'inProgress',
        //       message,
        //       compressed: true,
        //     };
      } catch (err) {
        logger.error({ err }, 'Error while encoding message');
      }
    }

    logger.info('3');

    const was = encode({ type: 'inProgress', message: outBuff, compressed: false });

    logger.info({ was: was.length }, '3');

    return { type: 'inProgress', message: outBuff.toString('base64'), compressed: false };
  } catch (error) {
    logger.error({ error }, 'Error while stepping in context');
    return { type: 'error', error };
  }
};

const buffToArr = (buf: Buffer): Uint8Array => {
  var a = new Uint8Array(buf.length);
  for (var i = 0; i < buf.length; i++) a[i] = buf[i];

  return a;
};
