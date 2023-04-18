import AsyncStorage from '@react-native-async-storage/async-storage';
import { Network } from '@superlight-labs/blockchain-api-client';
import { BitcoinBalance } from '@superlight-labs/blockchain-api-client/src/blockchains/bitcoin/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SharePair } from './bip32.state';

export type BitcoinState = {
  network: Network;
  index: 0 | 1;
  account: {
    xPub: string;
    share: SharePair;
  };
  indexAddress: {
    xPub: string;
    address: string;
    share: SharePair;
    balance?: BitcoinBalance;
  };
  updateBalance: (balance: BitcoinBalance) => void;
  saveAccount: (account: BitcoinState['account']) => void;
  saveAddress: (address: BitcoinState['indexAddress']) => void;
  setNetwork: (network: Network) => void;
};

export const useBitcoinState = create<BitcoinState>()(
  persist(
    set => ({
      network: __DEV__ ? 'test' : 'main',
      index: __DEV__ ? 1 : 0,
      account: {
        xPub: '',
        share: {
          share: '',
          path: '',
          peerShareId: '',
        },
      },
      indexAddress: {
        xPub: '',
        address: '',
        share: {
          share: '',
          path: '',
          peerShareId: '',
        },
      },
      updateBalance: (balance: BitcoinBalance) =>
        set(state => ({ indexAddress: { ...state.indexAddress, balance } })),
      saveAccount: (account: BitcoinState['account']) => set({ account }),
      saveAddress: (indexAddress: BitcoinState['indexAddress']) => set({ indexAddress }),
      setNetwork: (network: Network) => set({ network, index: network === 'main' ? 0 : 1 }),
    }),
    {
      name: 'bitcoin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
