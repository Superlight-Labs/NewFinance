import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SharePair = {
  share: string;
  path: string;
  peerShareId: string;
};

export type Bip32State = {
  secret: SharePair | undefined;
  master: SharePair | undefined;
  purpose: SharePair | undefined;
  coinType: SharePair | undefined;
  account: SharePair | undefined;
  change: SharePair | undefined;
  index: SharePair | undefined;
  name: string;
  hasHydrated: boolean;
  derivedUntilLevel: DerivedUntilLevel;
  setHasHydrated: (state: boolean) => void;
  delete: () => void;
  setName: (name: string) => void;
  setSecret: (data: SharePair) => void;
  setMaster: (data: SharePair) => void;
  setPurpose: (data: SharePair) => void;
  setCoinType: (data: SharePair) => void;
  setAccount: (data: SharePair) => void;
  setChange: (data: SharePair) => void;
  setIndex: (data: SharePair) => void;
};

export const useBip32State = create<Bip32State>()(
  persist(
    set => ({
      hasHydrated: false,
      secret: undefined,
      master: undefined,
      purpose: undefined,
      coinType: undefined,
      account: undefined,
      change: undefined,
      index: undefined,
      name: '',
      derivedUntilLevel: 0,
      setName: (name: string) => set(current => ({ ...current, name })),
      setSecret: (data: SharePair) =>
        set(current => ({ ...current, secret: data, derivedUntilLevel: 1 })),
      setMaster: (data: SharePair) =>
        set(current => ({ ...current, master: data, derivedUntilLevel: 2 })),
      setPurpose: (data: SharePair) =>
        set(current => ({ ...current, purpose: data, derivedUntilLevel: 3 })),
      setCoinType: (data: SharePair) =>
        set(current => ({ ...current, coinType: data, derivedUntilLevel: 4 })),
      setAccount: (data: SharePair) =>
        set(current => ({ ...current, account: data, derivedUntilLevel: 5 })),
      setChange: (data: SharePair) =>
        set(current => ({ ...current, change: data, derivedUntilLevel: 6 })),
      setIndex: (data: SharePair) =>
        set(current => ({ ...current, index: data, derivedUntilLevel: 7 })),
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
  return {
    secret: undefined,
    master: undefined,
    purpose: undefined,
    coinType: undefined,
    account: undefined,
    change: undefined,
    index: undefined,
    name: '',
    derivedUntilLevel: DerivedUntilLevel.NONE,
  } as Bip32State;
};

export enum DerivedUntilLevel {
  NONE = 0,
  SECRET = 1,
  MASTER = 2,
  PURPOSE = 3,
  COINTYPE = 4,
  ACCOUNT = 5,
  CHANGE = 6,
  COMPLETE = 7,
}
