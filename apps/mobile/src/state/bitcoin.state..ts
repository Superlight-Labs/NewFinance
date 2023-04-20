import AsyncStorage from '@react-native-async-storage/async-storage';
import { Network } from '@superlight-labs/blockchain-api-client';
import {
  BitcoinBalance,
  BitcoinTransaction,
} from '@superlight-labs/blockchain-api-client/src/blockchains/bitcoin/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SharePair } from './bip32.state';

export type BitcoinState = {
  network: Network;
  index: 0 | 1;
  account: {
    xPub: string;
    share: SharePair;
  };
  indexAddress: {
    xPub: string;
    address: string;
    publicKey: string;
    share: SharePair;
    transactions: BitcoinTransaction[];
    balance?: BitcoinBalance;
  };
  updateBalance: (balance: BitcoinBalance) => void;
  setTransactions: (transactions: BitcoinTransaction[]) => void;
  addTransactions: (transactions: BitcoinTransaction[]) => void;
  saveAccount: (account: BitcoinState['account']) => void;
  saveAddress: (address: BitcoinState['indexAddress']) => void;
  setNetwork: (network: Network) => void;
  deleteBitcoin: () => void;
};

export const useBitcoinState = create<BitcoinState>()(
  persist(
    set => ({
      network: __DEV__ ? 'test' : 'main',
      index: __DEV__ ? 1 : 0,
      account: {
        xPub: '',
        share: {
          share: '',
          path: '',
          peerShareId: '',
        },
      },
      indexAddress: {
        transactions: [],
        balance: undefined,
        xPub: '',
        address: '',
        publicKey: '',
        share: {
          share: '',
          path: '',
          peerShareId: '',
        },
      },
      addTransactions: (transactions: BitcoinTransaction[]) =>
        set(state => ({
          indexAddress: {
            ...state.indexAddress,
            transactions: [...(state.indexAddress.transactions || []), ...transactions],
          },
        })),
      setTransactions: (transactions: BitcoinTransaction[]) =>
        set(state => ({
          indexAddress: { ...state.indexAddress, transactions: transactions.sort() },
        })),
      updateBalance: (balance: BitcoinBalance) =>
        set(state => ({ indexAddress: { ...state.indexAddress, balance } })),
      saveAccount: (account: BitcoinState['account']) => set({ account }),
      saveAddress: (indexAddress: BitcoinState['indexAddress']) => set({ indexAddress }),
      setNetwork: (network: Network) => set({ network, index: network === 'main' ? 0 : 1 }),
      deleteBitcoin: () =>
        set({
          account: {
            xPub: '',
            share: { share: '', path: '', peerShareId: '' },
          },
          indexAddress: {
            xPub: '',
            address: '',
            publicKey: '',
            share: { share: '', path: '', peerShareId: '' },
            balance: undefined,
            transactions: [],
          },
        }),
    }),
    {
      name: 'bitcoin-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
