import { useDerive } from '@superlight/rn-mpc-client';
import { errAsync } from 'neverthrow';
import { useAuthState } from 'state/auth.state';
import { useBip32State } from 'state/bip32.state';
import { signWithDeviceKeyNoAuth } from 'util/auth';
import { appError } from 'util/error/error';
import { apiUrl } from 'util/superlight-api';
import { useFailableAction } from './useFailable';

export const useCreateBitcoinWallet = () => {
  const { deriveBip32, deriveBip32Hardened, deriveMasterPair } = useDerive();
  const { perform } = useFailableAction();
  const { user } = useAuthState();
  const { setAccount, setChange, setCoinType, setIndex, setMaster, setPurpose } = useBip32State();

  if (!user) {
    return () => perform(errAsync(appError(undefined, 'Not Authenticated!')));
  }

  const config = {
    baseUrl: apiUrl,
    sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
  };

  return (secretShare: string, peerSecretId: string) =>
    perform(
      // Derive Master from secret
      deriveMasterPair(config, { share: secretShare, peerShareId: peerSecretId })
        // Derive BIP44 Purpose-level keyshares
        .andThen(({ share, peerShareId }) => {
          const path = 'm';
          setMaster({ share, peerShareId, path });

          return deriveBip32Hardened(config, {
            index: '44',
            peerShareId,
            share,
            parentPath: path,
            hardened: true,
          });
        })
        // Derive cointype-level bitcoin keyshares
        .andThen(({ share, peerShareId }) => {
          const path = `m/44'`;
          setPurpose({ share, peerShareId, path });

          return deriveBip32Hardened(config, {
            index: '0',
            peerShareId,
            share,
            parentPath: path,
            hardened: true,
          });
        })
        // Derive account-level keyshares
        .andThen(({ share, peerShareId }) => {
          const path = `m/44'/0'`;
          setCoinType({ share, peerShareId, path });

          return deriveBip32Hardened(config, {
            index: '0',
            peerShareId,
            share,
            parentPath: path,
            hardened: true,
          });
        })
        // Derive change-level external keyshares
        .andThen(({ share, peerShareId }) => {
          const path = `m/44'/0'/0'`;
          setAccount({ share, peerShareId, path });

          return deriveBip32(config, {
            index: '0',
            peerShareId,
            share,
            parentPath: path,
            hardened: false,
          });
        })
        // Derive index-level keyshares
        .andThen(({ share, peerShareId }) => {
          const path = `m/44'/0'/0'/0`;
          setChange({ share, peerShareId, path });

          return deriveBip32(config, {
            index: '0',
            peerShareId,
            share,
            parentPath: path,
            hardened: false,
          });
        })
        .map(({ share, peerShareId }) => {
          const path = `m/44'/0'/0'/0/0`;
          setIndex({ share, peerShareId, path });

          return { share, peerShareId };
        })
    );
};
