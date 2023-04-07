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
  authenticate: (user: AppUser) => void;
  delete: () => void;
};

export const useAuthState = create<AuthState>()(
  persist(
    set => ({
      user: undefined,
      isAuthenticated: false,
      authenticate: user => set(_ => ({ user, isAuthenticated: true })),
      delete: () => set({ user: undefined, isAuthenticated: false }),
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
