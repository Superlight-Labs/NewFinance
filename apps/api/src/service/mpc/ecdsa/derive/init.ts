import { Context } from '@crypto-mpc';
import { SocketStream } from '@fastify/websocket';
import logger from '@lib/logger';
import {
  deleteKeyShare,
  readKeyShare,
  readKeyShareByPath,
} from 'src/repository/key-share.repository';
import { RawData } from 'ws';
import { buildPath } from '../../step/share';
import { DeriveConfig, DeriveContext } from './deriveBIP32';

export const initDerive = async (
  message: RawData,
  connection: SocketStream,
  userId: string
): Promise<DeriveContext> => {
  const deriveConfig = JSON.parse(message.toString()) as DeriveConfig;

  try {
    const path = buildPath(deriveConfig);
    const existingWallet = await readKeyShareByPath(path, userId);

    existingWallet && (await deleteKeyShare(existingWallet));
  } catch (err) {
    logger.error({ err }, 'Error while checking if keyshare has already been derived by user');
  }

  return setupContext(deriveConfig, connection, userId);
};

const setupContext = async (
  deriveConfig: DeriveConfig,
  connection: SocketStream,
  userId: string
): Promise<DeriveContext> => {
  try {
    const parentKeyShare = await readKeyShare(deriveConfig.serverShareId, userId);

    logger.info(
      { parent: { id: parentKeyShare.id, path: parentKeyShare.path }, deriveConfig },
      'INIT DERIVE'
    );

    const context = Context.createDeriveBIP32Context(
      2,
      Buffer.from(parentKeyShare.value as string, 'base64'),
      Number(deriveConfig.hardened) === 1,
      Number(deriveConfig.index)
    );

    connection.socket.send(JSON.stringify({ value: 'Start' }));

    return { deriveConfig, parent: parentKeyShare, context };
  } catch (err) {
    logger.error({ err }, 'Error while initiating Derive Bip32');
    connection.socket.close(undefined, 'Error while initiating Derive Bip32');
    throw err;
  }
};
