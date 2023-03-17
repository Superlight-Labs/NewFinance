import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppUser = {
    id: string, 
    devicePublicKey: string
}

export type AuthState = {user: AppUser | undefined, isAuthenticated: boolean, authenticate: (user: AppUser) => void,}

export const useAuthState = create<AuthState>()(persist(
    (set, get) => ({
        user: undefined,
        isAuthenticated: get().user !== undefined,
        authenticate: (user) => set((_) => ({user})),
    })

, {
    name: "auth-storage",
    storage: createJSONStorage(() => AsyncStorage)
}
))