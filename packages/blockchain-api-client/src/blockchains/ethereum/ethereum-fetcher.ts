import {
  ApiBalance,
  ApiBroadcastTransaction,
  ApiFees,
  ApiTokenBalances,
  ApiTransaction,
  ApiTransactionCount,
} from '../../base/types';

export interface EthereumFetcher {
  fetchBalance: (address: string) => Promise<ApiBalance>;
  fetchTransactions: (address: string) => Promise<ApiTransaction>;
  fetchERC20Transactions: (address: string) => Promise<ApiTransaction>;
  sendRawTransaction?: (transaction: string) => Promise<ApiBroadcastTransaction>;
  fetchFees: () => Promise<ApiFees>;
  fetchTransactionCount: (address: string) => Promise<ApiTransactionCount>;
  fetchTokenBalances: (address: string, contractAddresses: string[]) => Promise<ApiTokenBalances>;
  fetchEstimatedGas: (from: string, to: string, data: string) => Promise<ApiFees>;
}
