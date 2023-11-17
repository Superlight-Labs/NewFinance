import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type GeneralState = {
  hasHydrated: boolean;
  showedAlphaNotice: boolean;
  currency: Currency;
  currentPrices: any;
  showAlphaNotice: () => void;
  setHasHydrated: (state: boolean) => void;
  setCurrency: (state: Currency) => void;
  setCurrentPrices: (state: any) => void;
  deleteGeneralState: () => void;
};

export const useGeneralState = create<GeneralState>()(
  persist(
    set => ({
      hasHydrated: false,
      showedAlphaNotice: false,
      currency: 'BTC',
      currentPrices: {},
      showAlphaNotice: () => set({ showedAlphaNotice: true }),
      setCurrency: currency => set({ currency: currency }),
      setCurrentPrices: prices => set({ currentPrices: prices }),
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
