import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type GeneralState = {
  hasHydrated: boolean;
  showedAlphaNotice: boolean;
  showAlphaNotice: () => void;
  setHasHydrated: (state: boolean) => void;
};

export const useGeneralState = create<GeneralState>()(
  persist(
    set => ({
      hasHydrated: false,
      showedAlphaNotice: false,
      showAlphaNotice: () => set({ showedAlphaNotice: true }),
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
