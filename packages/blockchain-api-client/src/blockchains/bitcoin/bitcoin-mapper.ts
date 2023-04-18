import { ApiBalance, ApiBroadcastTransaction, ApiFees, ApiTransaction } from '../../base/types';
import { BitcoinBalance, BitcoinTransaction } from './types';

export interface BitcoinMapper {
  responseToBalance: (input: ApiBalance) => BitcoinBalance;
  responseToTransactions: (input: ApiTransaction) => BitcoinTransaction[];
  responseToBroadcastTransaction: (input: ApiBroadcastTransaction) => any;
  responseToFees: (input: ApiFees) => any;
}
