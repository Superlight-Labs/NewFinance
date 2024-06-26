import { Context } from '@crypto-mpc';
import { MPCRouteResult } from '@lib/routes/rest/rest-types';
import { databaseError } from '@superlight-labs/mpc-common';
import { OnSuccess } from '@superlight-labs/mpc-common/src/schema';
import { ResultAsync, okAsync } from 'neverthrow';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { getNewShare } from '../mpc-context.service';

type SuccessHandler = {
  [key in OnSuccess]: (context: Context, user: User, path?: string) => MPCRouteResult;
};

export const SuccessHandler: SuccessHandler = {
  saveKeyShare: (context: Context, user: User) => {
    const keyShare = context.getNewShare().toString('base64');
    context.free();

    return resultAsyncSaveKeyShare(user, keyShare, 'secret');
  },
  extractAndSaveNewShare: (context: Context, user: User, path?: string) => {
    return getNewShare(context).asyncAndThen(share => {
      context.free();
      return resultAsyncSaveKeyShare(user, share, path ?? 'MISSING-PATH');
    });
  },
  sign: (context: Context, user: User) => {
    context.free();
    return okAsync({ user, signDone: true });
  },
};

const resultAsyncSaveKeyShare = (user: User, keyShare: string, path: string) =>
  ResultAsync.fromPromise(saveKeyShare(user, keyShare, path), err =>
    databaseError(err, 'Error while saving generic secret key share')
  ).map(share => ({
    user,
    peerShareId: share.id,
  }));
