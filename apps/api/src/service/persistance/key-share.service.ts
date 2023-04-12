import { other, RouteError } from '@lib/routes/rest/rest-error';
import { getSafeResultAsync } from '@lib/utils/neverthrow';
import { databaseError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { MpcKeyShare } from 'src/repository/key-share';
import { dropKeyShare, patchUserKeyShare, readKeyShare } from 'src/repository/key-share.repository';

export const getKeyShare = (shareId: string, userId: string) => {
  return ResultAsync.fromPromise(readKeyShare(shareId, userId), err =>
    databaseError(err, 'Error while reading key share from database')
  );
};

export const deleteKeyShare = (share: MpcKeyShare | null) =>
  ResultAsync.fromPromise(dropKeyShare(share), err =>
    databaseError(err, 'Error while deleting Key-Share ')
  );

export const updateKeyShare = (
  keyShare: MpcKeyShare,
  address: string
): ResultAsync<MpcKeyShare, RouteError> => {
  return getSafeResultAsync(patchUserKeyShare({ ...keyShare, address }), e =>
    other('Error while updating Key Share', e)
  );
};
