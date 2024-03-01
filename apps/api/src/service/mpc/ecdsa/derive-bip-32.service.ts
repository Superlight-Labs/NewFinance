import { Context } from '@crypto-mpc';
import {
  buildPath,
  databaseError,
  DeriveRequest,
  MPCWebsocketMessage,
  WebsocketError,
} from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { MpcKeyShare } from 'src/repository/key-share';
import { readKeyShareByPath, saveShareBasedOnPath } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { deleteKeyShare, getKeyShare } from 'src/service/data/key-share.service';
import {
  createDeriveBIP32Context,
  getResultDeriveBIP32,
} from 'src/service/mpc/mpc-context.service';

export const initDeriveProcess = (
  deriveConfig: DeriveRequest,
  userId: string
): ResultAsync<DeriveContext, WebsocketError> => {
  const path = buildPath(deriveConfig);

  return deleteExistingShareByPath(path, userId).andThen(_ => setupContext(deriveConfig, userId));
};

const deleteExistingShareByPath = (
  path: string,
  userId: string
): ResultAsync<MpcKeyShare | null, WebsocketError> => {
  return ResultAsync.fromPromise(readKeyShareByPath(path, userId), err =>
    databaseError({ err, path }, 'Error while checking if keyshare with path exists')
  ).andThen(deleteKeyShare);
};

const setupContext = (
  deriveConfig: DeriveRequest,
  userId: string
): ResultAsync<DeriveContext, WebsocketError> => {
  return getKeyShare(deriveConfig.peerShareId, userId).andThen(parentKeyShare =>
    createDeriveBIP32Context(parentKeyShare.value, deriveConfig.hardened, deriveConfig.index).map(
      context => ({ deriveConfig, parent: parentKeyShare, context })
    )
  );
};

export const deriveWithoutStepping = (deriveContext: DeriveContext, user: User) => {
  return getResultDeriveBIP32(deriveContext.context)
    .asyncAndThen(share => saveDerivedShare(user, share, deriveContext))
    .map(_ => {
      deriveContext.context.free();
      return { user };
    });
};

const saveDerivedShare = (
  user: User,
  share: string,
  deriveContext: DeriveContext
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  const { parent, deriveConfig } = deriveContext;

  return ResultAsync.fromPromise(saveShareBasedOnPath(user, share, parent, deriveConfig), err =>
    databaseError(err, 'Error while saving derived Keyshare to DB')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};

type DeriveContext = {
  deriveConfig: DeriveRequest;
  parent: MpcKeyShare;
  context: Context;
};
