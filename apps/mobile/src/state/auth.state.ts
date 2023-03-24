import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteKeyPair } from '@superlight/rn-secure-encryption-module';
import { constants } from 'util/constants';
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
  logout: () => void;
};

export const useAuthState = create<AuthState>()(
  persist(
    set => ({
      user: undefined,
      isAuthenticated: false,
      authenticate: user => set(_ => ({ user, isAuthenticated: true })),
      logout: () => set(logout),
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const logout = (_: AuthState) => {
  deleteKeyPair(constants.deviceKeyName);

  return { user: undefined, isAuthenticated: false };
};
