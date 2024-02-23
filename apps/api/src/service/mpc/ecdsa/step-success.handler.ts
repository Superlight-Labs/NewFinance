import { MPCRouteResult } from '@lib/routes/rest/rest-types';
import { databaseError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { Context } from 'vm';

export enum OnSuccess {
  SaveKeyShare = 'saveKeyShare',
}

type SuccessHandler = {
  [key in OnSuccess]: (context: Context, user: User) => MPCRouteResult;
};

export const SuccessHandler: SuccessHandler = {
  saveKeyShare: (context: Context, user: User) => {
    const keyShare = context.getNewShare().toString('base64');
    context.free();

    return ResultAsync.fromPromise(saveKeyShare(user, keyShare, 'secret'), err =>
      databaseError(err, 'Error while saving generic secret key share')
    ).map(share => ({ user }));
  },
};
