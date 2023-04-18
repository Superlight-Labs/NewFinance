import {
  ApiBalance,
  ApiBroadcastTransaction,
  ApiFees,
  ApiTokenBalances,
  ApiTransaction,
  ApiTransactionCount,
} from '../../base/types';
import { EthereumBalance, EthereumTokenBalances, EthereumTransaction } from './types';

export interface EthereumMapper {
  responseToBalance: (input: ApiBalance) => EthereumBalance;
  responseToTransactions: (input: ApiTransaction) => EthereumTransaction[];
  responseToBroadcastTransaction: (input: ApiBroadcastTransaction) => string;
  responseToTransactionCount: (input: ApiTransactionCount) => string;
  responseToFees: (input: ApiFees) => string;
  responseToTokenBalances: (input: ApiTokenBalances) => EthereumTokenBalances;
}
