import { Context } from '@crypto-mpc';
import { MPCRouteResult } from '@lib/routes/rest/rest-types';
import { databaseError } from '@superlight-labs/mpc-common';
import { OnSuccess } from '@superlight-labs/mpc-common/src/schema';
import { ResultAsync } from 'neverthrow';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { getNewShare } from '../mpc-context.service';

type SuccessHandler = {
  [key in OnSuccess]: (context: Context, user: User) => MPCRouteResult;
};

export const SuccessHandler: SuccessHandler = {
  saveKeyShare: (context: Context, user: User) => {
    const keyShare = context.getNewShare().toString('base64');
    context.free();

    return resultAsyncSaveKeyShare(user, keyShare, 'secret');
  },
  extractAndSaveNewShare: (context: Context, user: User) => {
    return getNewShare(context).asyncAndThen(share => {
      context.free();
      return resultAsyncSaveKeyShare(user, share, 'context');
    });
  },
};

const resultAsyncSaveKeyShare = (user: User, keyShare: string, path: string) =>
  ResultAsync.fromPromise(saveKeyShare(user, keyShare, path), err =>
    databaseError(err, 'Error while saving generic secret key share')
  ).map(share => ({
    user,
    peerShareId: share.id,
  }));
