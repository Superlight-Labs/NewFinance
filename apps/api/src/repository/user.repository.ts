import { Context } from '@crypto-mpc';
import { notFound, other, RouteError } from '@lib/routes/rest/rest-error';
import { client } from '@superlight-labs/database';
import { CreateUserRequest } from 'src/routes/user.routes';
import { MpcKeyShare } from './key-share';
import { GetUserRequest, User } from './user';

export const createUser = async (request: CreateUserRequest): Promise<User> => {
  const user = await client.user.create({
    data: { ...request },
    include: { keyShares: true },
  });

  if (!user) throw other('Error while creating User');

  return user;
};

export const readUser = async (request: GetUserRequest): Promise<User | RouteError> => {
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

export const isUsernameOrEmailTaken = async (
  usernameOrEmail: string
): Promise<boolean | RouteError> => {
  const usernameOrEmailTaken = await client.user.findFirst({
    where: {
      OR: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    },
  });

  if (usernameOrEmailTaken) return true;
  return false;
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

export const updateDeriveContext = async (user: User, deriveContext: Context): Promise<User> => {
  const updatedUser = await client.user.update({
    where: { id_devicePublicKey: { id: user.id, devicePublicKey: user.devicePublicKey } },
    data: { deriveContext: deriveContext.toBuffer() },
  });

  return updatedUser as any as User;
};

export const deleteDeriveContext = async (user: User): Promise<boolean> => {
  const updatedUser = await client.user.update({
    where: { id_devicePublicKey: { id: user.id, devicePublicKey: user.devicePublicKey } },
    data: { deriveContext: null },
  });

  if (!updatedUser) throw other('Error while deleting derive context');

  return true;
};
