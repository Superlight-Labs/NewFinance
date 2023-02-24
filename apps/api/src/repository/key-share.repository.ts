import { notFound, other } from '@lib/routes/rest/rest-error';
import { client } from '@superlight/database';
import { MpcKeyShare } from './key-share';
import { User } from './user';

export const deleteKeyShare = (keyShare: MpcKeyShare) => {
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
