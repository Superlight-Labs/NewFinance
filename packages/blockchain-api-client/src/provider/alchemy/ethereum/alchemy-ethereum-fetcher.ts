import { Chain, Network } from '../../../base/types';
import { fetchFromAlchemy, Method } from '../http';
import { alchemyEndpoints } from './alchemy-ethereum-endpoints';
import {
  AlchemyBalance,
  AlchemyBroadCastTransaction,
  AlchemyFees,
  AlchemyTokenBalances,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from './alchemy-ethereum-types';

export const alchemyEthereumFetcher = (network: Network, chain: Chain) => ({
  fetchBalance: (address: string) =>
    fetchFromAlchemy<AlchemyBalance>(alchemyEndpoints(network, chain), Method.Balance, [address, 'latest']),
  fetchTransactions: async (address: string) =>
    await Promise.all([
      fetchAlchemyTransactions('from', network, chain, address, ['external']),
      fetchAlchemyTransactions('to', network, chain, address, ['external']),
    ]),
  fetchERC20Transactions: async (address: string) =>
    await Promise.all([
      fetchAlchemyTransactions('from', network, chain, address, ['erc20']),
      fetchAlchemyTransactions('to', network, chain, address, ['erc20']),
    ]),
  sendRawTransaction: (transaction: string) =>
    fetchFromAlchemy<AlchemyBroadCastTransaction>(alchemyEndpoints(network, chain), Method.SendTransaction, [
      transaction,
    ]),
  fetchFees: () => fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(network, chain), Method.GasPrice),
  fetchTransactionCount: (address: string) =>
    fetchFromAlchemy<AlchemyTransactionCount>(alchemyEndpoints(network, chain), Method.TransactionCount, [
      address,
      'latest',
    ]),
  fetchTokenBalances: (address: string, contractAddresses: string[]) =>
    fetchFromAlchemy<AlchemyTokenBalances>(alchemyEndpoints(network, chain), Method.TokenBalances, [
      address,
      contractAddresses,
    ]),
  fetchEstimatedGas: (from: string, to: string, data: string) =>
    fetchFromAlchemy<AlchemyFees>(alchemyEndpoints(network, chain), Method.EstimateGas, [{ from, to, data }]),
});

const fetchAlchemyTransactions = (
  mode: 'from' | 'to',
  network: Network,
  chain: Chain,
  address: string,
  category: string[]
) =>
  fetchFromAlchemy<AlchemyTransaction>(alchemyEndpoints(network, chain), Method.Transactions, [
    getTransactionQuery(address, mode, category),
  ]);

const getTransactionQuery = (address: string, mode: 'from' | 'to', category: string[]) => ({
  fromBlock: '0x0',
  fromAddress: mode === 'from' ? address : undefined,
  toAddress: mode === 'to' ? address : undefined,
  toBlock: 'latest',
  category: category,
});
