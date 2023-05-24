import AsyncStorage from '@react-native-async-storage/async-storage';
import { Network } from '@superlight-labs/blockchain-api-client';
import {
  BitcoinBalance,
  BitcoinTransaction,
} from '@superlight-labs/blockchain-api-client/src/blockchains/bitcoin/types';
import Big from 'big.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SharePair } from './derive.state';
import { createJSONStorage } from './zustand.plugin';

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

export type BitcoinState = {
  network: Network;
  accounts: Map<AccountKey, Account>;
  addresses: Map<AccountKey, Map<ChangeIndex, AddressInfo>>;
};

type BitcoinActions = {
  hasAddress: () => boolean;
  getTotalBalance: () => number;
  getAccountBalance: (account: string) => number;
  getAccountTransactions: (account: string) => AccountTransaction[];
  getAccExternalAddress: (account: string) => AddressInfo;
  getAccountAddresses: (account: string) => Addresses;
  updateBalance: (balance: BitcoinBalance, account: string, address: string) => void;
  setTransactions: (transactions: BitcoinTransaction[], account: string, address: string) => void;
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
  network: __DEV__ ? 'test' : 'test', // TODO: change to main for production
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
      getAccountAddresses: (account: string) => getAccountAddresses(get().addresses, account),
      getAccExternalAddress: (account: string) => getAccExternalAddress(get(), account),
      addTransactions: (transactions: BitcoinTransaction[], account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const address = accountAddresses?.get(index);

          if (!address || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: new Map(state.addresses).set(
              account,
              new Map(accountAddresses).set(index, {
                ...address,
                transactions: [...(address.transactions || []), ...transactions],
              })
            ),
          };
        }),
      setTransactions: (transactions: BitcoinTransaction[], account: string, address: string) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const addressStore = getByAddress(accountAddresses, address);

          if (!addressStore || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: new Map(state.addresses).set(
              account,
              new Map(accountAddresses).set(addressStore.index, {
                ...addressStore.addressInfo,
                transactions: transactions,
              })
            ),
          };
        }),
      updateBalance: (balance: BitcoinBalance, account: string, address: string) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);
          const addressStore = getByAddress(accountAddresses, address);

          if (!addressStore || !accountAddresses) throw new Error('Address not found');

          return {
            addresses: new Map(state.addresses).set(
              account,
              new Map(accountAddresses).set(addressStore.index, {
                ...addressStore.addressInfo,
                balance,
              })
            ),
          };
        }),
      saveAccount: (account: Account, name: string) =>
        set(state => ({ accounts: new Map(state.accounts).set(name, account) })),
      saveAddress: (address: AddressInfo, account: string, index: ChangeIndex) =>
        set(state => {
          const accountAddresses = state.addresses.get(account);

          return {
            addresses: new Map(state.addresses).set(
              account,
              new Map(accountAddresses).set(index, address)
            ),
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

const getAccountAddresses = (
  addresses: Map<string, Map<ChangeIndex, AddressInfo>>,
  account: string
): Addresses => {
  const accountAddresses = addresses.get(account);

  if (!accountAddresses) throw new Error('Account not found');

  const external = accountAddresses.get(ChangeIndex.EXTERNAL);
  const change = accountAddresses.get(ChangeIndex.CHANGE);

  if (!external || !change) throw new Error('Address has incomplete information');

  return { external, change };
};

export type Addresses = {
  external: AddressInfo;
  change: AddressInfo;
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

  const balance = [...accountAddresses].reduce((acc, [_, address]) => {
    if (!address.balance) return acc;

    return acc.add(new Big(address.balance.incoming).sub(new Big(address.balance.outgoing)));
  }, new Big(0));

  return balance.toNumber() || 0;
};

/**
 *
 * @returns Accumulated transactions of Addresses belonging to Account
 */
const getAccountTransactions = (
  addresses: Map<string, Map<ChangeIndex, AddressInfo>>,
  account: string
): AccountTransaction[] => {
  const accountAddresses = addresses.get(account);
  if (!accountAddresses) return [];

  const allBitcoinTransactions = [...accountAddresses].reduce<AccountTransaction[]>(
    (acc, [_, address]) =>
      [
        ...acc,
        ...address.transactions.map(trans => ({
          ...trans,
          address,
          incomming: !!trans.outputs.find(o => o.address === address.address),
        })),
      ].sort((x, y) => y.time - x.time),
    []
  );

  return allBitcoinTransactions;
};

export type AccountTransaction = BitcoinTransaction & {
  address: AddressInfo;
  incomming: boolean;
};

function getByAddress(map: Map<ChangeIndex, AddressInfo> | undefined, searchValue: string) {
  if (!map) return undefined;

  for (let [index, addressInfo] of map.entries()) {
    if (addressInfo.address === searchValue) return { index, addressInfo };
  }
}
