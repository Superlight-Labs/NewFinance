import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppUser = {
  id: string;
  devicePublicKey: string;
  username: string;
  email: string;
};

export type AuthState = {
  user: AppUser | undefined;
  isAuthenticated: boolean;
  hasKeysSetUp: boolean;
  hasHydrated: boolean;
  login: () => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  registerUser: (user: AppUser) => void;
  deleteUser: () => void;
};

export const useAuthState = create<AuthState>()(
  persist(
    set => ({
      hasHydrated: false,
      user: undefined,
      hasKeysSetUp: false,
      isAuthenticated: false,
      logout: () => set({ isAuthenticated: false }),
      login: () => set({ isAuthenticated: true }),
      registerUser: user => set(_ => ({ user, hasKeysSetUp: true, isAuthenticated: true })),
      deleteUser: () => set({ user: undefined, hasKeysSetUp: false, isAuthenticated: false }),
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
