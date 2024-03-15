import { Context } from '@crypto-mpc';
import { SignWithShare, WebsocketError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { getKeyShare } from 'src/service/data/key-share.service';
import { createEcdsaSignContext } from 'src/service/mpc/mpc-context.service';

export const initSignProcess = (
  message: SignWithShare,
  userId: string
): ResultAsync<Context, WebsocketError> => {
  const { messageToSign, encoding, peerShareId } = message;

  return getKeyShare(peerShareId, userId).andThen(keyShare =>
    createEcdsaSignContext(keyShare.value, messageToSign, encoding)
  );
};
