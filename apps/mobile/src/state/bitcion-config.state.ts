import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type BitcoinNetwork = 'mainnet' | 'testnet';

export type BitcoinConfigState = {
  network: BitcoinNetwork;
  index: 0 | 1;
  setNetwork: (network: BitcoinNetwork) => void;
};

export const useBitcoinConfigState = create<BitcoinConfigState>()(
  persist(
    set => ({
      network: __DEV__ ? 'testnet' : 'mainnet',
      index: __DEV__ ? 1 : 0,
      setNetwork: (network: BitcoinNetwork) =>
        set({ network, index: network === 'mainnet' ? 0 : 1 }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
