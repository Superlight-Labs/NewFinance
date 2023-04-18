import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppUser = {
  id: string;
  devicePublicKey: string;
};

export type AuthState = {
  user: AppUser | undefined;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  authenticate: (user: AppUser) => void;
  deleteAuth: () => void;
};

export const useAuthState = create<AuthState>()(
  persist(
    set => ({
      hasHydrated: false,
      user: undefined,
      isAuthenticated: false,
      authenticate: user => set(_ => ({ user, isAuthenticated: true })),
      deleteAuth: () => set({ user: undefined, isAuthenticated: false }),
      setHasHydrated: (state: boolean) => {
        set({
          hasHydrated: state,
        });
      },
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    }
  )
);
