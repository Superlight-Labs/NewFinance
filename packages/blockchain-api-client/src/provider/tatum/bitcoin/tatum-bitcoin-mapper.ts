import { BroadcastTransaction, Fees } from '../../../base/types';
import { BitcoinBalance, BitcoinTransaction } from '../../../blockchains/bitcoin/types';
import { TatumBalance, TatumBroadcastTransaction, TatumFees, TatumTransaction } from './tatum-bitcoin-types';

export const mapTatumBalance = (input: TatumBalance): BitcoinBalance => input;
export const mapTatumTransactions = (transactions: TatumTransaction[]): BitcoinTransaction[] =>
  transactions.map(transaction => ({ ...transaction, total: undefined }));
export const mapTatumFees = (fees: TatumFees): Fees => fees;
export const mapTatumBroadcastTransaction = (broadcastTransaction: TatumBroadcastTransaction): BroadcastTransaction =>
  broadcastTransaction;
