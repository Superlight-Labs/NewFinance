import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SharePair } from './bip32.state';

export type BitcoinNetwork = 'main' | 'test';

// TODO add account xpub and shar pair for convenient access
// same for address
// use bip32 fromxPub and bitcoin-adapter from walletPOC - you deleted smth on accident you fool
export type BitcoinState = {
  network: BitcoinNetwork;
  index: 0 | 1;
  account: {
    xPub: string;
    share: SharePair;
  };
  saveAccount: (account: BitcoinState['account']) => void;
  setNetwork: (network: BitcoinNetwork) => void;
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
      saveAccount: (account: BitcoinState['account']) => set({ account }),
      setNetwork: (network: BitcoinNetwork) => set({ network, index: network === 'main' ? 0 : 1 }),
    }),
    {
      name: 'bitcoin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
