import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Bip32Data = {
  share: string;
  path: string;
  peerShareId: string;
  name: string;
};

export type Bip32State = {
  data: Bip32Data | undefined;
  hasBip32State: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  create: (data: Bip32Data) => void;
  delete: () => void;
};

export const useBip32State = create<Bip32State>()(
  persist(
    set => ({
      hasHydrated: false,
      data: undefined,
      hasBip32State: false,
      create: data => set(_ => ({ data, hasBip32State: true })),
      delete: () => set(deleteBip32State),
      setHasHydrated: (state: boolean) => {
        set({
          hasHydrated: state,
        });
      },
    }),
    {
      name: 'bip-32-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    }
  )
);

const deleteBip32State = (_: Bip32State) => {
  return { data: undefined, hasBip32State: false };
};
