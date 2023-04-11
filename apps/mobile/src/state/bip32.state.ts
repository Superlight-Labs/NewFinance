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
  createdUntil: CreatedUntil;
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
      createdUntil: 'none',
      setName: (name: string) => set(current => ({ ...current, name })),
      setSecret: (data: SharePair) =>
        set(current => ({ ...current, secret: data, createdUntil: 'secret' })),
      setMaster: (data: SharePair) =>
        set(current => ({ ...current, master: data, createdUntil: 'master' })),
      setPurpose: (data: SharePair) =>
        set(current => ({ ...current, purpose: data, createdUntil: 'purpose' })),
      setCoinType: (data: SharePair) =>
        set(current => ({ ...current, coinType: data, createdUntil: 'coinType' })),
      setAccount: (data: SharePair) =>
        set(current => ({ ...current, account: data, createdUntil: 'account' })),
      setChange: (data: SharePair) =>
        set(current => ({ ...current, change: data, createdUntil: 'change' })),
      setIndex: (data: SharePair) =>
        set(current => ({ ...current, index: data, createdUntil: 'complete' })),
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
    createdUntil: 'none',
  } as Bip32State;
};

export type CreatedUntil =
  | 'none'
  | 'secret'
  | 'master'
  | 'purpose'
  | 'coinType'
  | 'account'
  | 'change'
  | 'complete';
