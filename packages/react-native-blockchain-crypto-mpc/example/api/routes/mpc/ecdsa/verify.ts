import { other } from '@lib/error';
import { route } from '@lib/route';
import { FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';

import { Share } from '@crypto-mpc';
import { db } from '@lib/dev-db';
import { ec } from 'elliptic';

import { Buffer } from 'buffer';

export const verifyEcdsaSignature = route<boolean>((req: FastifyRequest) => {
  //TODO: Type
  const { message, signature } = req.body as any;
  const curve = new ec('secp256k1');

  // TODO: remove this in favor of real db. Will be async in nature and therefore need a ResultAsync
  const share = Share.fromBuffer(db.shareBuf);
  db.shareBuf = undefined;

  const publicKey = share.getEcdsaPublic().slice(23);

  const key = curve.keyFromPublic(publicKey);

  return ResultAsync.fromPromise(
    new Promise((resolve) =>
      resolve(
        key.verify(
          Buffer.from(message, 'base64'),
          new Uint8Array(Buffer.from(signature, 'base64'))
        )
      )
    ),
    (err) => other('Failed to verify', err as Error)
  );
});
