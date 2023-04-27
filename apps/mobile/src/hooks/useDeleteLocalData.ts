import { deleteKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { useDeriveState } from 'state/derive.state';
import { constants } from 'utils/constants';

export const useDeleteLocalData = () => {
  const { deleteBip32 } = useDeriveState();
  const { deleteUser } = useAuthState();
  const { deleteBitcoin } = useBitcoinState();

  return {
    deleteLocalData: () => {
      deleteBip32();
      deleteUser();
      deleteBitcoin();
      deleteKeyPair(constants.deviceKeyName);
    },
  };
};
