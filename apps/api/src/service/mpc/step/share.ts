import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import constants from '@lib/constants';
import logger from '@lib/logger';
import { MpcKeyShare } from 'src/repository/key-share';
import { saveBip44MasterKeyShare, saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';

import { DeriveConfig } from '../ecdsa/derive/deriveBIP32';

export const processDerivedShare = async (
  user: User,
  share: string,
  parent: MpcKeyShare,
  connection: SocketStream,
  deriveConfig: DeriveConfig
) => {
  try {
    const { path, id: serverShareId } = await saveDerivedShare(user, share, parent, deriveConfig);

    connection.socket.send(JSON.stringify({ done: true, serverShareId, path }));
    connection.socket.close(undefined, 'Done saving Derived Share');
  } catch (err) {
    logger.error({ err }, 'Error while saving Derived Share');
    connection.socket.close(undefined, 'Error while saving Derived Share');
  }
};

const saveDerivedShare = async (
  user: User,
  share: string,
  parent: MpcKeyShare,
  deriveConfig: DeriveConfig
): Promise<MpcKeyShare> => {
  const keyShare = await saveShareBasedOnPath(user, share, parent, deriveConfig);

  logger.info(
    {
      ...keyShare,
      keyShare: keyShare.value?.slice(0, 23),
    },
    'main keyShare  derived'
  );

  return keyShare;
};

const saveShareBasedOnPath = (
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

export const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === 'm') return 'm';

  return `${parentPath}/${index}${hardened === '1' ? "'" : ''}`;
};

export const saveShare = async (user: User, context: Context, connection: SocketStream) => {
  try {
    const keyShare = await saveKeyShare(user, context.getNewShare().toString('base64'), 'ecdsa');

    logger.info(
      {
        ...keyShare,
        keyShare: keyShare.value?.slice(0, 23),
      },
      'keyShare main key derived'
    );

    connection.socket.send(JSON.stringify({ done: true, serverShareId: keyShare.id }));
    connection.socket.close(undefined, 'Done Generating Ecdsa Key Shares');
  } catch (err) {
    logger.error({ err }, 'Error while saving main key from Ecdas Init');
    connection.socket.close(undefined, 'Error while saving main key from Ecdas Init');
  }
};
