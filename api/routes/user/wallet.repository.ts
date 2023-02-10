import { notFound, other } from "@lib/route/error";
import { client } from "../../server";
import { User } from "./user";
import { MpcKeyShare } from "./wallet";

export const deleteWallet = (wallet: MpcKeyShare) => {
  return client.mpcKeyShare.delete({
    where: {
      id: wallet.id,
    },
  });
};

export const createDerivedWallet = async (
  user: User,
  share: string,
  path: string
): Promise<MpcKeyShare> => {
  return client.mpcKeyShare.create({
    data: {
      keyShare: share,
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

export const createWallet = (
  user: User,
  share: string,
  path: string
): Promise<MpcKeyShare> => {
  return client.mpcKeyShare.create({
    data: {
      keyShare: share,
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

export const getWallet = async (
  id: string,
  userId: string
): Promise<MpcKeyShare> => {
  const wallet = await client.mpcKeyShare.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!wallet) throw notFound("No Wallet Found");

  return wallet;
};

export const getWalletByPath = async (
  path: string,
  userId: string
): Promise<MpcKeyShare | null> => {
  const wallet = await client.mpcKeyShare.findUnique({
    where: {
      userId_path: {
        userId,
        path,
      },
    },
  });

  return wallet;
};

export const createBip44MasterKeyShare = async (
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
          keyShare: share,
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

    if (!master) throw other("Error while creating BIP44 Master Wallet");

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
