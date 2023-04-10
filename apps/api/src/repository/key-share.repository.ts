import constants from '@lib/constants';
import { notFound, other, RouteError } from '@lib/routes/rest/rest-error';
import { client } from '@superlight/database';
import { buildPath, DeriveConfig } from '@superlight/mpc-common';
import { MpcKeyShare } from './key-share';
import { User } from './user';

export const dropKeyShare = async (keyShare: MpcKeyShare | null): Promise<MpcKeyShare | null> => {
  if (keyShare === null) {
    return keyShare;
  }

  return client.mpcKeyShare.delete({
    where: {
      id: keyShare.id,
    },
  });
};

export const saveKeyShare = (user: User, keyShare: string, path: string): Promise<MpcKeyShare> => {
  return client.mpcKeyShare.create({
    data: {
      value: keyShare,
      path,
      user: {
        connect: {
          id_devicePublicKey: {
            id: user.id,
            devicePublicKey: user.devicePublicKey,
          },
        },
      },
    },
  });
};

export const saveShareBasedOnPath = (
  user: User,
  share: string,
  parent: MpcKeyShare,
  deriveConfig: DeriveConfig
): Promise<MpcKeyShare> => {
  const path = buildPath(deriveConfig);

  if (deriveConfig.index === constants.bip44MasterIndex) {
    return saveBip44MasterKeyShare(user, parent.id, share, path);
  }

  return saveKeyShare(user, share, path);
};

export const readKeyShare = async (id: string, userId: string): Promise<MpcKeyShare> => {
  const keyShare = await client.mpcKeyShare.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!keyShare) throw notFound('No keyShare Found');

  return keyShare;
};

export const readKeyShareByPath = async (
  path: string,
  userId: string
): Promise<MpcKeyShare | null> => {
  const keyShare = await client.mpcKeyShare.findUnique({
    where: {
      userId_path: {
        userId,
        path,
      },
    },
  });

  return keyShare;
};

export const saveBip44MasterKeyShare = async (
  user: User,
  parentId: string,
  share: string,
  path: string
): Promise<MpcKeyShare> => {
  try {
    const result = await client.$transaction([
      client.mpcKeyShare.delete({
        where: {
          id: parentId,
        },
      }),
      client.mpcKeyShare.create({
        data: {
          value: share,
          path,
          user: {
            connect: {
              id_devicePublicKey: {
                id: user.id,
                devicePublicKey: user.devicePublicKey,
              },
            },
          },
        },
      }),
    ]);

    const master = result[1];

    if (!master) throw other('Error while creating BIP44 Master keyShare');

    return master;
  } catch (err) {
    await client.mpcKeyShare.delete({
      where: {
        id: parentId,
      },
    });
    throw err;
  }
};

export const patchUserKeyShare = async (
  keyShare: MpcKeyShare
): Promise<MpcKeyShare | RouteError> => {
  const updated = await client.mpcKeyShare.update({ where: { id: keyShare.id }, data: keyShare });

  if (!updated) return other('Something went wrong while updating, no success value returned');

  return updated;
};
