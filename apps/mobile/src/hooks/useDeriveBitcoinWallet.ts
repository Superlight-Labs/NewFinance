import logger from '@superlight-labs/logger';
import { AppError, appError } from '@superlight-labs/mpc-common';
import { getXPubKey, useDerive } from '@superlight-labs/rn-mpc-client';
import { ShareResult } from '@superlight-labs/rn-mpc-client/src/lib/mpc/mpc-types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppUser, useAuthState } from 'state/auth.state';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';
import { useSnackbarState } from 'state/snackbar.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { publicKeyToBitcoinAddressP2WPKH } from 'utils/crypto/bitcoin-address';
import { apiUrl } from 'utils/superlight-api';
import { useFailableAction } from './useFailable';

export const useCreateBitcoinWallet = () => {
  const { perform } = useFailableAction();
  const { user } = useAuthState();

  const deriveSteps = useDeriveSteps(user);

  if (!user) {
    return () => perform(errAsync(appError(undefined, 'Not Authenticated!')));
  }

  return (secretShare: string, peerSecretId: string) =>
    perform(
      deriveSteps
        .deriveAndSaveMaster({ share: secretShare, peerShareId: peerSecretId })
        .andThen(deriveSteps.deriveAndSavePurpose)
        .andThen(deriveSteps.deriveAndSaveCoinType)
        .andThen(deriveSteps.deriveAndSaveAccount)
        .andThen(deriveSteps.deriveAndSaveChange)
        .andThen(deriveSteps.deriveAndSaveIndex)
    );
};

type Derivations = {
  [key: string]: (parent: ShareResult) => ResultAsync<ShareResult, AppError>;
};

const useDeriveSteps = (user: AppUser | undefined): Derivations => {
  const { network, saveAccount, saveAddress } = useBitcoinState();
  const { setMessage } = useSnackbarState();
  const { deriveBip32, deriveBip32Hardened, deriveMasterPair } = useDerive();
  const {
    setAccount,
    setIndex,
    setChange,
    setCoinType,
    setMaster,
    setPurpose,
    derivedUntilLevel,
    ...rest
  } = useBip32State();

  if (!user) throw new Error('User is not authenticated!');

  const config = {
    baseUrl: apiUrl,
    sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
  };

  return {
    deriveAndSaveMaster: ({ share: s, peerShareId: pId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.SECRET) {
        logger.debug('Skip Derive master');
        return okAsync(rest.master!);
      }

      setMessage({ message: 'Setting up your wallet...', step: 1, total: 4, level: 'progress' });

      return deriveMasterPair(config, { share: s, peerShareId: pId }).map(
        ({ share, peerShareId }) => {
          setMaster({ share, peerShareId, path: 'm' });
          return { share, peerShareId };
        }
      );
    },
    deriveAndSavePurpose: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.MASTER) {
        logger.debug('Skip Derive puropse');
        return okAsync(rest.purpose!);
      }

      setMessage({ message: 'Creating Secure wallet...', step: 2, total: 4, level: 'progress' });

      return deriveBip32Hardened(config, {
        index: '84',
        peerShareId,
        share,
        parentPath: 'm',
        hardened: true,
      }).map(({ share: s, peerShareId: pId }) => {
        setPurpose({ share: s, peerShareId: pId, path: `m/84'` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveCoinType: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.COINTYPE) {
        logger.debug('Skip Derive coinType');
        return okAsync(rest.coinType!);
      }

      setMessage({
        message: 'Introducing you to Bitcoin...',
        step: 3,
        total: 4,
        level: 'progress',
      });

      return deriveBip32Hardened(config, {
        index: '0',
        peerShareId,
        share,
        parentPath: `m/84'`,
        hardened: true,
      }).map(({ share: s, peerShareId: pId }) => {
        setCoinType({ share: s, peerShareId: pId, path: `m/84'/0'` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveAccount: ({ share: cTShare, peerShareId: ctShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.PURPOSE) {
        logger.debug('Skip Derive account');
        return okAsync(rest.account!);
      }

      const path = `m/84'/0'/0'`;

      setMessage({ message: 'Adding your account...', step: 4, total: 4, level: 'progress' });

      return deriveBip32Hardened(config, {
        index: '0',
        peerShareId: ctShareId,
        share: cTShare,
        parentPath: `m/84'/0'`,
        hardened: true,
      })
        .andThen(({ share, peerShareId }) => {
          return getXPubKey(share, network).map(key => {
            saveAccount({ share: { share, peerShareId, path }, xPub: key.xPubKey });
            return { share, peerShareId };
          });
        })
        .map(({ share, peerShareId }) => {
          setAccount({ share, peerShareId, path });
          return { share, peerShareId };
        });
    },
    deriveAndSaveChange: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.ACCOUNT) {
        logger.debug('Skip Derive change');
        return okAsync(rest.change!);
      }

      return deriveBip32(config, {
        index: '0',
        peerShareId,
        share,
        parentPath: `m/84'/0'/0'`,
        hardened: false,
      }).map(({ share: s, peerShareId: pId }) => {
        setChange({ share: s, peerShareId: pId, path: `m/84'/0'/0'/0` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveIndex: ({ share: cShare, peerShareId: cShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.CHANGE) {
        logger.debug('Skip Derive index');
        return okAsync(rest.index!);
      }

      const path = `m/84'/0'/0'/0/0`;

      return deriveBip32(config, {
        index: '0',
        peerShareId: cShareId,
        share: cShare,
        parentPath: `m/84'/0'/0'/0`,
        hardened: false,
      })
        .andThen(({ share, peerShareId }) => {
          return getXPubKey(share)
            .andThen(result => publicKeyToBitcoinAddressP2WPKH(result.xPubKey, network))
            .map(({ xPub, address, publicKey }) => {
              saveAddress({
                share: { share, peerShareId, path },
                xPub,
                publicKey,
                address,
                transactions: [],
              });
              return { share, peerShareId };
            });
        })
        .map(({ share, peerShareId }) => {
          setMessage({ message: 'Congrats! all done', level: 'success' });

          setIndex({ share, peerShareId, path });
          return { share, peerShareId };
        });
    },
  };
};
