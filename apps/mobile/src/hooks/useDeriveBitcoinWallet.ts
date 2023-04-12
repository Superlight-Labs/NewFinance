import logger from '@superlight-labs/logger';
import { useDerive } from '@superlight-labs/rn-mpc-client';
import { ShareResult } from '@superlight-labs/rn-mpc-client/src/lib/mpc/mpc-types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { AppUser, useAuthState } from 'state/auth.state';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { AppError } from 'state/snackbar.state';
import { signWithDeviceKeyNoAuth } from 'util/auth';
import { appError } from 'util/error/error';
import { apiUrl } from 'util/superlight-api';
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

  logger.debug({ derivedUntilLevel }, 'Derive until level');

  return {
    deriveAndSaveMaster: ({ share: s, peerShareId: pId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.SECRET) {
        logger.debug('Skip Derive master');
        return okAsync(rest.master!);
      }

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

      return deriveBip32Hardened(config, {
        index: '44',
        peerShareId,
        share,
        parentPath: 'm',
        hardened: true,
      }).map(({ share: s, peerShareId: pId }) => {
        setPurpose({ share: s, peerShareId: pId, path: `m/44'` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveCoinType: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.COINTYPE) {
        logger.debug('Skip Derive coinType');
        return okAsync(rest.coinType!);
      }

      return deriveBip32Hardened(config, {
        index: '0',
        peerShareId,
        share,
        parentPath: `m/44'`,
        hardened: true,
      }).map(({ share: s, peerShareId: pId }) => {
        setCoinType({ share: s, peerShareId: pId, path: `m/44'/0'` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveAccount: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.PURPOSE) {
        logger.debug('Skip Derive account');
        return okAsync(rest.account!);
      }

      return deriveBip32Hardened(config, {
        index: '0',
        peerShareId,
        share,
        parentPath: `m/44'/0'`,
        hardened: true,
      }).map(({ share: s, peerShareId: pId }) => {
        setAccount({ share: s, peerShareId: pId, path: `m/44'/0'/0'` });
        return { share: s, peerShareId: pId };
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
        parentPath: `m/44'/0'/0'`,
        hardened: false,
      }).map(({ share: s, peerShareId: pId }) => {
        setChange({ share: s, peerShareId: pId, path: `m/44'/0'/0'/0` });
        return { share: s, peerShareId: pId };
      });
    },
    deriveAndSaveIndex: ({ share, peerShareId }) => {
      if (derivedUntilLevel > DerivedUntilLevel.CHANGE) {
        logger.debug('Skip Derive index');
        return okAsync(rest.index!);
      }

      return deriveBip32(config, {
        index: '0',
        peerShareId,
        share,
        parentPath: `m/44'/0'/0'/0`,
        hardened: false,
      }).map(({ share: s, peerShareId: pId }) => {
        setIndex({ share: s, peerShareId: pId, path: `m/44'/0'/0'/0/0` });
        return { share: s, peerShareId: pId };
      });
    },
  };
};
