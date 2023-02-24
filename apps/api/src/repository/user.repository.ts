import { notFound, other, RouteError } from '@lib/routes/rest/rest-error';
import { client } from '@superlight/database';
import { MpcKeyShare } from './key-share';
import { CreateUserRequest, User } from './user';

export const saveUser = async (request: CreateUserRequest): Promise<User> => {
  const user = await client.user.create({
    data: { ...request },
    include: { keyShares: true },
  });

  if (!user) throw other('Error while creating User');

  return user;
};

export const readUser = async (request: GetUser): Promise<User | RouteError> => {
  const { userId, devicePublicKey } = request;

  const user = await client.user.findUnique({
    where: {
      id_devicePublicKey: {
        id: userId,
        devicePublicKey,
      },
    },
    include: { keyShares: true },
  });

  if (!user) return notFound('User not found');

  return user;
};

export const readUserKeyShareByPath = async (
  user: User,
  path: string
): Promise<MpcKeyShare | RouteError> => {
  const userWithKeyShares = await client.user.findUnique({
    where: { id_devicePublicKey: { id: user.id, devicePublicKey: user.devicePublicKey } },
    include: { keyShares: { where: { path } } },
  });

  if (!userWithKeyShares || userWithKeyShares.keyShares.length !== 1)
    return other('User with incorrect number of keyshares found for path', {
      userWithKeyShares,
      path,
    });

  return userWithKeyShares.keyShares[0];
};

export const updateUserKeyShare = async (
  keyShare: MpcKeyShare
): Promise<MpcKeyShare | RouteError> => {
  const updated = await client.mpcKeyShare.update({ where: { id: keyShare.id }, data: keyShare });

  if (!updated) return other('Something went wrong while updating, no success value returned');

  return updated;
};

type GetUser = {
  userId: string;
  devicePublicKey: string;
};
