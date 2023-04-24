import { deleteKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { useDeriveState } from 'state/derive.state';
import { constants } from 'utils/constants';

export const useLogout = () => {
  const { deleteBip32 } = useDeriveState();
  const { deleteAuth } = useAuthState();
  const { deleteBitcoin } = useBitcoinState();

  return {
    logout: () => {
      deleteBip32();
      deleteAuth();
      deleteBitcoin();
      deleteKeyPair(constants.deviceKeyName);
    },
  };
};
