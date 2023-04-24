import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import { AppError, appError } from '@superlight-labs/mpc-common';
import { Psbt, SignerAsync } from 'der-bitcoinjs-lib';
import { ECPair } from 'ecpair';
import { Result, ResultAsync, err, ok } from 'neverthrow';
import { AccountTransaction } from 'state/bitcoin.state';

export const getPeerOfTransaction = (
  transaction: BitcoinTransaction,
  address: string,
  changeAddress: string
): string => {
  const outs = transaction.outputs;
  const sender =
    outs.find(output => output.address !== address && output.address !== changeAddress) ||
    outs[outs.length - 1];

  return sender?.address || '';
};

export const isSTXO = (
  transaction: BitcoinTransaction,
  allTransactions: BitcoinTransaction[]
): boolean =>
  allTransactions.some((searchTransaction: BitcoinTransaction) =>
    searchTransaction.inputs.find(input => input.prevout.hash === transaction.hash)
  );

/**
 * finds the index in outputs in utxo which can be spent again and is in our control (a address from account)
 * @param utxo
 * @param account
 * @returns
 */
export const getOutputIndexFromUtxo = (
  utxo: BitcoinTransaction,
  address: string,
  changeAddress: string
): number => {
  return utxo.outputs.findIndex(
    output => output.address === address || output.address === changeAddress
  );
};

/**
 * find change (value in satoshis) from utxo to use in new transaction
 * @param utxo
 * @param account
 * @returns
 */
const getTransactionValue = (
  utxo: BitcoinTransaction,
  address: string,
  changeAddress: string
): number => {
  const incomingTransaction = utxo.outputs.find(
    output => output.address === address || output.address === changeAddress
  );
  return incomingTransaction?.value || 0;
};

export const getValueOfTransactions = (
  transactions: BitcoinTransaction[],
  address: string,
  changeAddress: string
): number => {
  return transactions.reduce((prev, curr) => {
    return prev + getTransactionValue(curr, address, changeAddress);
  }, 0);
};

const signAllInputs = async (
  preparedTransaction: Psbt,
  preparedSigners: SignerAsync[]
): Promise<Psbt> => {
  for (let i = 0; i < preparedSigners.length; i++) {
    await preparedTransaction.signInputAsync(i, preparedSigners[i]);
  }

  return preparedTransaction;
};

export const signAndFinalize = (
  transaction: Psbt,
  signers: SignerAsync[]
): ResultAsync<Psbt, AppError> => {
  return ResultAsync.fromPromise(signAllInputs(transaction, signers), error =>
    appError(error, 'Signing failed')
  )
    .andThen(validate)
    .andThen(finalize);
};

const finalize = Result.fromThrowable(
  (transaction: Psbt) => transaction.finalizeAllInputs(),
  error => appError(error, 'Insufficient balance')
);

const validate = Result.fromThrowable(
  (transaction: Psbt) => {
    transaction.validateSignaturesOfAllInputs(validator);
    return transaction;
  },
  error => appError(error, 'Invalid signature')
);

const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

export const getUnusedTransactionsNeededToReachValue = (
  allUnspent: AccountTransaction[],
  value: number, //in satoshis,
  address: string,
  changeAddress: string
): Result<AccountTransaction[], AppError> => {
  const result = allUnspent
    .sort((a, b) => a.time - b.time)
    .reduce(
      (acc, curr, _index, _all) => {
        const { transactions, accumulatedValue } = acc;

        const utxoValue = getTransactionValue(curr, address, changeAddress);

        if (accumulatedValue >= value) {
          return acc;
        }

        return {
          transactions: [...transactions, curr],
          accumulatedValue: accumulatedValue + utxoValue,
        };
      },
      { transactions: [] as AccountTransaction[], accumulatedValue: 0 }
    );

  if (result.accumulatedValue < value) {
    return err(appError('Not enough transactions to fulfill action', 'Insufficient balance'));
  }

  return ok(result.transactions);
};

/**
 * To avoid double display of transactions, we need to check if the transaction is a change transaction.
 *
 * @returns if the transaction should be treated differently because it is a change transaction
 */
export const isIncommingChange = (transaction: AccountTransaction, changeAddress: string) => {
  return (
    transaction.address.address === changeAddress &&
    !transaction.inputs.find(i => i.coin.address === changeAddress) &&
    !!transaction.outputs.find(o => o.address === changeAddress)
  );
};
