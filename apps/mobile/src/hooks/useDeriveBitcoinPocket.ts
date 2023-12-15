import { API_URL } from '@env';
import logger from '@superlight-labs/logger';
import { getXPubKey, useDerive } from '@superlight-labs/rn-mpc-client';
import { ShareResult } from '@superlight-labs/rn-mpc-client/src/lib/mpc/mpc-types';
import { Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { AppUser, useAuthState } from 'state/auth.state';
import { ChangeIndex, useBitcoinState } from 'state/bitcoin.state';
import { useDeriveState } from 'state/derive.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { publicKeyToBitcoinAddressP2WPKH } from 'utils/crypto/bitcoin-address';
import { useFailableAction } from './useFailable';

const options = {
  taskName: 'CreatingYourWallet',
  taskTitle: 'Creating your wallet',
  taskDesc: 'We are creating a Standard BIP84 Bitcoin wallet for you.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  // linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
};

export const useCreateBitcoinPocket = (name: string, naviagteBack: () => void) => {
  const { perform } = useFailableAction();
  const { user } = useAuthState();

  const { deriveAndSaveAccount, deriveAddresses } = useDeriveSteps(user, name);
  const { coinType } = useDeriveState();
  console.log('inside useCreateBitcoinPocket');
  if (!coinType) {
    throw new Error('CoinType is not set');
  }

  console.log('cointype is Set');

  const deriveInBackground = async (onSuccessCb: () => void) => {
    console.log('start deriving in background');
    BackgroundService.on('expiration', () => {
      console.log('I am being closed :(');
    });

    const prom = (_: unknown) =>
      new Promise<void>(resolve => {
        const { onSuccess } = perform(
          deriveAndSaveAccount({
            share: coinType.share,
            peerShareId: coinType.peerShareId,
          }).andThen(deriveAddresses),
          naviagteBack
        );

        onSuccess(() => {
          onSuccessCb;
          BackgroundService.stop();
          resolve();
        });
      });

    return await BackgroundService.start(prom, options);
  };

  const deriveInForeground = async (onSuccessCb: () => void) => {
    BackgroundService.on('expiration', () => {
      console.log('I am being closed :(');
    });

    const backgroundTask = async (taskData: any) => {
      logger.info({ taskData }, 'WTF');

      await new Promise<void>(resolve => {
        const { onSuccess } = perform(
          deriveAndSaveAccount({
            share: coinType.share,
            peerShareId: coinType.peerShareId,
          }).andThen(deriveAddresses),
          naviagteBack
        );

        onSuccess(() => {
          onSuccessCb;
          resolve();
        });
      });
    };
    return await backgroundTask(options);
  };

  // TODO: get Background tasks working on both platforms
  return Platform.OS === 'ios' ? deriveInBackground : deriveInForeground;
};

type AccountShareResult = ShareResult & { changeIndex: ChangeIndex };

const useDeriveSteps = (user: AppUser | undefined, name: string) => {
  const { network, saveAccount, saveAddress, accounts } = useBitcoinState();
  const accountIndex = accounts.size;

  //const { setMessage } = useSnackbarState();
  const { deriveBip32, deriveBip32Hardened } = useDerive();

  if (!user) throw new Error('User is not authenticated!');

  const config = {
    baseUrl: API_URL,
    sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
  };

  const deriveAndSaveAccount = ({ share: cTShare, peerShareId: ctShareId }: ShareResult) => {
    const path = `m/84'/0'/${accountIndex}'`;

    //setMessage({ message: 'Adding your account...', step: 4, total: 4, level: 'progress' });
    return deriveBip32Hardened(config, {
      index: `${accountIndex}`,
      peerShareId: ctShareId,
      share: cTShare,
      parentPath: `m/84'/0'`,
      hardened: true,
    }).andThen(({ share, peerShareId }) => {
      return getXPubKey(share, network).map(key => {
        saveAccount({ share: { share, peerShareId, path }, xPub: key.xPubKey }, name);

        return { share, peerShareId };
      });
    });
  };

  const deriveAndSaveIndex = ({
    share: cShare,
    peerShareId: cShareId,
    changeIndex,
  }: AccountShareResult) => {
    const path = `m/84'/0'/${accountIndex}'/${changeIndex}/0`;

    return deriveBip32(config, {
      index: '0',
      peerShareId: cShareId,
      share: cShare,
      parentPath: `m/84'/0'/${accountIndex}'/${changeIndex}`,
      hardened: false,
    }).andThen(({ share, peerShareId }) => {
      return getXPubKey(share)
        .andThen(result => publicKeyToBitcoinAddressP2WPKH(result.xPubKey, network))
        .map(({ xPub, address, publicKey }) => {
          saveAddress(
            {
              share: { share, peerShareId, path },
              xPub,
              account: name,
              publicKey,
              address,
              transactions: [],
            },
            name,
            changeIndex
          );
          return { share, peerShareId };
        });
    });
  };

  const deriveAddresses = ({ share, peerShareId }: ShareResult) => {
    logger.info('first non hardened derive');
    return deriveBip32(config, {
      index: '0',
      peerShareId,
      share,
      parentPath: `m/84'/0'/${accountIndex}'`,
      hardened: false,
    })
      .map(({ share: s, peerShareId: pId }) => {
        return { share: s, peerShareId: pId, changeIndex: 0 };
      })
      .andThen(deriveAndSaveIndex)
      .andThen(_ =>
        deriveBip32(config, {
          index: '1',
          peerShareId,
          share,
          parentPath: `m/84'/0'/${accountIndex}'`,
          hardened: false,
        })
      )
      .map(({ share: s, peerShareId: pId }) => {
        return { share: s, peerShareId: pId, changeIndex: 1 };
      })
      .andThen(deriveAndSaveIndex)
      .map(val => {
        //setMessage({ message: 'Congrats! all done', level: 'success' });

        return val;
      });
  };

  return {
    deriveAndSaveAccount,
    deriveAddresses,
    deriveAndSaveIndex,
  };
};
