import { databaseError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { MpcKeyShare } from 'src/repository/key-share';
import { dropKeyShare, readKeyShare } from 'src/repository/key-share.repository';

export const getKeyShare = (shareId: string, userId: string) => {
  return ResultAsync.fromPromise(readKeyShare(shareId, userId), err =>
    databaseError(err, 'Error while reading key share from database')
  );
};

export const deleteKeyShare = (share: MpcKeyShare | null) =>
  ResultAsync.fromPromise(dropKeyShare(share), err =>
    databaseError(err, 'Error while deleting Key-Share ')
  );
