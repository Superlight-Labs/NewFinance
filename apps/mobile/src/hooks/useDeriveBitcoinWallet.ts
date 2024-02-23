import { API_URL } from '@env';
import logger from '@superlight-labs/logger';
import { getXPubKey, useDerive } from '@superlight-labs/rn-mpc-client';
import { ShareResult } from '@superlight-labs/rn-mpc-client/src/lib/mpc/mpc-neverthrow-wrapper';
import { okAsync } from 'neverthrow';
import { Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { AppUser, useAuthState } from 'state/auth.state';
import { ChangeIndex, useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
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

export const useCreateBitcoinWallet = (naviagteBack: () => void) => {
  const { perform } = useFailableAction();
  const { user } = useAuthState();

  const {
    deriveAndSaveMaster,
    deriveAndSavePurpose,
    deriveAndSaveCoinType,
    deriveAndSaveAccount,
    deriveAddresses,
  } = useDeriveSteps(user);

  const deriveInBackground =
    (secretShare: ShareResult | undefined) => async (onSuccessCb: () => void) => {
      BackgroundService.on('expiration', () => {
        console.log('I am being closed :(');
      });

      const prom = (_: unknown) =>
        new Promise<void>(resolve => {
          const { onSuccess } = perform(
            deriveAndSaveMaster(secretShare)
              .andThen(deriveAndSavePurpose)
              .andThen(deriveAndSaveCoinType)
              .andThen(deriveAndSaveAccount)
              .andThen(deriveAddresses),
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

  const deriveInForeground =
    (secretShare: ShareResult | undefined) => async (onSuccessCb: () => void) => {
      BackgroundService.on('expiration', () => {
        console.log('I am being closed :(');
      });

      const backgroundTask = async (taskData: any) => {
        logger.info({ taskData }, 'WTF');

        await new Promise<void>(resolve => {
          const { onSuccess } = perform(
            deriveAndSaveMaster(secretShare)
              .andThen(deriveAndSavePurpose)
              .andThen(deriveAndSaveCoinType)
              .andThen(deriveAndSaveAccount)
              .andThen(deriveAddresses),
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

const useDeriveSteps = (user: AppUser | undefined) => {
  const { network, saveAccount, saveAddress, accounts } = useBitcoinState();

  //const { setMessage } = useSnackbarState();
  const { deriveBip32, deriveBip32Hardened, deriveMasterPair } = useDerive();
  const {
    setCoinType,
    setMaster,
    setPurpose,
    derivedUntilLevel,
    master,
    purpose,
    coinType,
    setLevel,
    name,
  } = useDeriveState();

  if (!user) throw new Error('User is not authenticated!');

  const config = {
    baseUrl: API_URL,
    sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
  };
  const deriveAndSaveMaster = (secretShare: ShareResult | undefined) => {
    if (derivedUntilLevel >= DerivedUntilLevel.MASTER || !secretShare) {
      logger.debug('Skip Derive master');
      return okAsync(master!);
    }
    const { share: sShare, peerShareId: pId } = secretShare;

    //setMessage({ message: 'Setting up your wallet...', step: 1, total: 4, level: 'progress' });

    return deriveMasterPair(config, { share: sShare, peerShareId: pId }).map(
      ({ share: mShare, peerShareId }) => {
        setMaster({ share: mShare, peerShareId, path: 'm' });
        return { share: mShare, peerShareId };
      }
    );
  };

  const deriveAndSavePurpose = ({ share, peerShareId }: ShareResult) => {
    if (derivedUntilLevel >= DerivedUntilLevel.PURPOSE) {
      logger.debug('Skip Derive puropse');
      return okAsync(purpose!);
    }

    //setMessage({ message: 'Creating Secure wallet...', step: 2, total: 4, level: 'progress' });

    return deriveBip32Hardened(config, {
      index: '84',
      peerShareId,
      share,
      parentPath: 'm',
      hardened: true,
    }).map(({ share: pShare, peerShareId: pId }) => {
      setPurpose({ share: pShare, peerShareId: pId, path: "m/84'" });
      return { share: pShare, peerShareId: pId };
    });
  };

  const deriveAndSaveCoinType = ({ share, peerShareId }: ShareResult) => {
    if (derivedUntilLevel >= DerivedUntilLevel.COINTYPE) {
      logger.debug('Skip Derive coinType');
      return okAsync(coinType!);
    }

    /*setMessage({
      message: 'Introducing you to Bitcoin...',
      step: 3,
      total: 4,
      level: 'progress',
    });*/

    return deriveBip32Hardened(config, {
      index: '0',
      peerShareId,
      share,
      parentPath: "m/84'",
      hardened: true,
    }).map(({ share: s, peerShareId: pId }) => {
      setCoinType({ share: s, peerShareId: pId, path: "m/84'/0'" });
      return { share: s, peerShareId: pId };
    });
  };

  const deriveAndSaveAccount = ({ share: cTShare, peerShareId: ctShareId }: ShareResult) => {
    if (derivedUntilLevel >= DerivedUntilLevel.ACCOUNT && accounts.has(name)) {
      logger.debug('Skip Derive account');
      return okAsync(accounts.get(name)!.share);
    }

    const path = `m/84'/0'/0'`;

    //setMessage({ message: 'Adding your account...', step: 4, total: 4, level: 'progress' });
    return deriveBip32Hardened(config, {
      index: '0',
      peerShareId: ctShareId,
      share: cTShare,
      parentPath: `m/84'/0'`,
      hardened: true,
    }).andThen(({ share, peerShareId }) => {
      return getXPubKey(share, network).map(key => {
        saveAccount({ share: { share, peerShareId, path }, xPub: key.xPubKey }, name);
        setLevel(DerivedUntilLevel.ACCOUNT);

        return { share, peerShareId };
      });
    });
  };

  const deriveAndSaveIndex = ({
    share: cShare,
    peerShareId: cShareId,
    changeIndex,
  }: AccountShareResult) => {
    const path = `m/84'/0'/0'/${changeIndex}/0`;

    return deriveBip32(config, {
      index: '0',
      peerShareId: cShareId,
      share: cShare,
      parentPath: `m/84'/0'/0'/${changeIndex}`,
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
      parentPath: `m/84'/0'/0'`,
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
          parentPath: `m/84'/0'/0'`,
          hardened: false,
        })
      )
      .map(({ share: s, peerShareId: pId }) => {
        return { share: s, peerShareId: pId, changeIndex: 1 };
      })
      .andThen(deriveAndSaveIndex)
      .map(val => {
        //setMessage({ message: 'Congrats! all done', level: 'success' });

        setLevel(DerivedUntilLevel.COMPLETE);
        return val;
      });
  };

  return {
    deriveAndSaveMaster,
    deriveAndSavePurpose,
    deriveAndSaveCoinType,
    deriveAndSaveAccount,
    deriveAddresses,
    deriveAndSaveIndex,
  };
};
