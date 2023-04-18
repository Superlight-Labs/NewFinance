import { BroadcastTransaction, Fees, Input, Output } from '../../../base/types';
import { BitcoinBalance, BitcoinTransaction } from '../../../blockchains/bitcoin/types';
import {
  BlockCyperFees,
  BlockCypherBalance,
  BlockCypherBalanceFull,
  BlockCypherTransaction,
} from './blockcypher-bitcoin-types';

export const mapBlockCypherBalance = (balance: BlockCypherBalance): BitcoinBalance => {
  return {
    incoming: balance.total_received,
    outgoing: balance.total_sent,
    unconfirmedBalance: balance.unconfirmed_balance,
    confirmedBalance: balance.final_balance,
  };
};

export const mapBlockCypherTransactions = (transaction: BlockCypherBalanceFull): BitcoinTransaction[] => {
  return transaction.txs.map<BitcoinTransaction>((transaction, index) => ({
    blockNumber: transaction.block_index,
    fee: transaction.fees,
    hash: transaction.hash,
    hex: transaction.hex || '',
    index,
    inputs: transaction.inputs.map<Input>(input => ({
      prevout: {
        hash: input.prev_hash,
        index: input.output_index,
      },
      sequence: input.sequence,
      script: input.script,
      scriptType: input.script_type,
      coin: {
        version: 0,
        height: 0,
        value: input.output_value,
        script: input.script,
        address: input.addresses[0],
        coinbase: false,
      },
    })),
    locktime: transaction.lock_time,
    outputs: transaction.outputs.map<Output>(output => ({
      value: output.value,
      script: output.script,
      address: output.addresses[0],
    })),
    size: transaction.size,
    time: transaction.received.getTime(),
    version: transaction.ver,
    vsize: transaction.vsize,
    total: transaction.total,
    witnessHash: transaction.witness_hash || '',
  }));
};

//TODO use blockcypher fee endpoint
export const mapBlockCypherFees = (_fees: BlockCyperFees): Fees => {
  return { fast: 0, medium: 0, slow: 0 };
};

export const mapBlockCypherBroadcastTransaction = (
  _broadcastTransaction: BlockCypherTransaction
): BroadcastTransaction => {
  return { txId: '', failed: true };
};
