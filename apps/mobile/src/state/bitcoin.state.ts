import AsyncStorage from '@react-native-async-storage/async-storage';
import { Network } from '@superlight-labs/blockchain-api-client';
import {
  BitcoinBalance,
  BitcoinTransaction,
} from '@superlight-labs/blockchain-api-client/src/blockchains/bitcoin/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SharePair } from './derive.state';
import { createJSONStorage } from './zustand-persist.shim';

export enum ChangeIndex {
  EXTERNAL = 0,
  CHANGE = 1,
}

type Account = {
  xPub: string;
  share: SharePair;
};

export type AddressInfo = {
  account: string;
  xPub: string;
  address: string;
  publicKey: string;
  share: SharePair;
  transactions: BitcoinTransaction[];
  balance?: BitcoinBalance;
};

type AccountKey = string;

export type ExternalAddress = {
  address: string;
  publicKey: string;
  share: SharePair;
  xPub: string;
};

export type BitcoinState = {
  network: Network;
  accounts: Map<AccountKey, Account>;
  addresses: Map<AccountKey, Map<ChangeIndex, AddressInfo>>;
};

type BitcoinActions = {
  hasAddress: () => boolean;
  getTotalBalance: () => number;
  getAccountBalance: (account: string) => number;
  getAccountTransactions: (account: string) => BitcoinTransaction[];
  getAccExternalAddress: (account: string) => ExternalAddress;
  updateBalance: (balance: BitcoinBalance, account: string, index: ChangeIndex) => void;
  setTransactions: (
    transactions: BitcoinTransaction[],
    account: string,
    index: ChangeIndex
  ) => void;
  addTransactions: (
    transactions: BitcoinTransaction[],
    account: string,
    index: ChangeIndex
  ) => void;
  saveAccount: (account: Account, name: string) => void;
  saveAddress: (address: AddressInfo, account: string, index: ChangeIndex) => void;
  setNetwork: (network: Network) => void;
  deleteBitcoin: () => void;
};

const initial: BitcoinState = {
  network: __DEV__ ? 'test' : 'main',
  accounts: new Map<string, Account>(),
  addresses: new Map<string, Map<ChangeIndex, AddressInfo>>(),
};

export const useBitcoinState = create<BitcoinState & BitcoinActions>()(
  persist(
    (set, get) => ({
      ...initial,
      hasAddress: () => get().addresses.size > 0,
      getTotalBalance: () => calculateTotalBalance(get().addresses),
      getAccountBalance: (account: string) => calculateAccountBalance(get().addresses, account),
      getAccountTransactions: (account: string) => getAccountTransactions(get().addresses, account),
      getAccExternalAddress: (account: string) => getAccExternalAddress(get(), account),
      addTransactions: (transactions: BitcoinTransaction[], account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const address = accountAddresses?.get(index);

          if (!address || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: state.addresses.set(
              account,
              accountAddresses.set(index, {
                ...address,
                transactions: [...(address.transactions || []), ...transactions].sort(),
              })
            ),
          };
        }),
      setTransactions: (transactions: BitcoinTransaction[], account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const address = accountAddresses?.get(index);

          if (!address || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: state.addresses.set(
              account,
              accountAddresses.set(index, { ...address, transactions: transactions.sort() })
            ),
          };
        }),
      updateBalance: (balance: BitcoinBalance, account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const address = accountAddresses?.get(index);

          if (!address || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: state.addresses.set(
              account,
              accountAddresses.set(index, { ...address, balance })
            ),
          };
        }),
      saveAccount: (account: Account, name: string) =>
        set(state => ({ accounts: new Map(state.accounts).set(name, account) })),
      saveAddress: (address: AddressInfo, account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);

          return {
            addresses: state.addresses.set(account, new Map(accountAddresses).set(index, address)),
          };
        }),
      setNetwork: (network: Network) => set({ network }),
      deleteBitcoin: () =>
        set({
          ...initial,
          accounts: new Map<string, Account>(),
          addresses: new Map<AccountKey, Map<ChangeIndex, AddressInfo>>(),
        }),
    }),
    {
      name: 'bitcoin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const getAccExternalAddress = (state: BitcoinState, account: string): AddressInfo => {
  const accountAddresses = state.addresses.get(account);
  const external = accountAddresses?.get(ChangeIndex.EXTERNAL);

  if (!external) throw new Error('Address not found');

  return external;
};

const calculateTotalBalance = (addresses: Map<string, Map<ChangeIndex, AddressInfo>>): number => {
  const addressesArr = [...addresses.entries()].map(([key, _]) => key);

  return addressesArr.reduce(
    (acc, account) => acc + calculateAccountBalance(addresses, account),
    0
  );
};

/**
 *
 * @returns Accumulated value of Account in BTC
 */
const calculateAccountBalance = (
  addresses: Map<string, Map<ChangeIndex, AddressInfo>>,
  account: string
): number => {
  const accountAddresses = addresses.get(account);
  if (!accountAddresses) return 0;

  return [...accountAddresses].reduce((acc, [_, address]) => {
    if (!address.balance) return acc;

    return acc + (address.balance.incoming - address.balance.outgoing);
  }, 0);
};

/**
 *
 * @returns Accumulated transactions of Addresses belonging to Account
 */
const getAccountTransactions = (
  addresses: Map<string, Map<ChangeIndex, AddressInfo>>,
  account: string
): BitcoinTransaction[] => {
  const accountAddresses = addresses.get(account);
  if (!accountAddresses) return [];

  return [...accountAddresses].reduce<BitcoinTransaction[]>(
    (acc, [_, address]) => [...acc, ...address.transactions].sort(),
    []
  );
};
