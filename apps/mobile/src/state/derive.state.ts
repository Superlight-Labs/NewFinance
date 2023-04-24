import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SharePair = {
  share: string;
  path: string;
  peerShareId: string;
};

export type DeriveState = {
  secret: SharePair | undefined;
  master: SharePair | undefined;
  purpose: SharePair | undefined;
  coinType: SharePair | undefined;
  name: string;
  hasHydrated: boolean;
  derivedUntilLevel: DerivedUntilLevel;
  setHasHydrated: (state: boolean) => void;
  deleteBip32: () => void;
  setName: (name: string) => void;
  setSecret: (data: SharePair) => void;
  setMaster: (data: SharePair) => void;
  setPurpose: (data: SharePair) => void;
  setCoinType: (data: SharePair) => void;
  setLevel: (level: DerivedUntilLevel) => void;
};

export const useDeriveState = create<DeriveState>()(
  persist(
    set => ({
      hasHydrated: false,
      secret: undefined,
      master: undefined,
      purpose: undefined,
      coinType: undefined,
      name: '',
      derivedUntilLevel: 0,
      setName: (name: string) => set(current => ({ ...current, name })),
      setSecret: (data: SharePair) =>
        set(current => ({ ...current, secret: data, derivedUntilLevel: 1 })),
      setMaster: (data: SharePair) =>
        set(current => ({ ...current, secret: undefined, master: data, derivedUntilLevel: 2 })),
      setPurpose: (data: SharePair) =>
        set(current => ({ ...current, purpose: data, derivedUntilLevel: 3 })),
      setCoinType: (data: SharePair) =>
        set(current => ({ ...current, coinType: data, derivedUntilLevel: 4 })),
      deleteBip32: () => set(deleteBip32State),
      setLevel: (level: DerivedUntilLevel) =>
        set(current => ({ ...current, derivedUntilLevel: level })),
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

const deleteBip32State = (_: DeriveState) => {
  return {
    secret: undefined,
    master: undefined,
    purpose: undefined,
    coinType: undefined,
    name: '',
    derivedUntilLevel: DerivedUntilLevel.NONE,
  } as DeriveState;
};

export enum DerivedUntilLevel {
  NONE = 0,
  SECRET = 1,
  MASTER = 2,
  PURPOSE = 3,
  COINTYPE = 4,
  ACCOUNT = 5,
  COMPLETE = 6,
}
