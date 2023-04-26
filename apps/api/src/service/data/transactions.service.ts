import { RouteError, other } from '@lib/routes/rest/rest-error';
import { ResultAsync } from 'neverthrow';
import { Transaction } from 'src/repository/transaction';
import { createTransaction, readTransactions } from 'src/repository/transaction.repository';
import { CreateTransactionRequest } from 'src/routes/transaction.routes';

export const createNewTransaction = (
  request: CreateTransactionRequest
): ResultAsync<Transaction, RouteError> => {
  return ResultAsync.fromPromise(createTransaction(request), e =>
    other('Err while saving transaction', e)
  );
};

export const getTransactions = (userAddress: string): ResultAsync<Transaction[], RouteError> => {
  const transactions = ResultAsync.fromPromise(readTransactions(userAddress), e =>
    other('Err while reading Transactions', e)
  );

  return transactions;
};
