import { deleteKeyPair } from '@superlight/rn-secure-encryption-module';
import { useAuthState } from 'state/auth.state';
import { useBip32State } from 'state/bip32.state';
import { constants } from 'util/constants';

export const useLogout = () => {
  const { delete: delBip } = useBip32State();
  const { delete: delAuth } = useAuthState();

  return {
    logout: () => {
      delBip();
      delAuth();
      deleteKeyPair(constants.deviceKeyName);
    },
  };
};
