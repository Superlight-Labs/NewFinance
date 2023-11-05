import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type GeneralState = {
  hasHydrated: boolean;
  showedAlphaNotice: boolean;
  currency: Currency;
  showAlphaNotice: () => void;
  setHasHydrated: (state: boolean) => void;
  setCurrency: (state: Currency) => void;
  deleteGeneralState: () => void;
};

export const useGeneralState = create<GeneralState>()(
  persist(
    set => ({
      hasHydrated: false,
      showedAlphaNotice: false,
      currency: 'BTC',
      showAlphaNotice: () => set({ showedAlphaNotice: true }),
      setCurrency: currency => set({ currency: currency }),
      deleteGeneralState: () => set({ showedAlphaNotice: false }),
      setHasHydrated: (state: boolean) => {
        set({
          hasHydrated: state,
        });
      },
    }),

    {
      name: 'general-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    }
  )
);
