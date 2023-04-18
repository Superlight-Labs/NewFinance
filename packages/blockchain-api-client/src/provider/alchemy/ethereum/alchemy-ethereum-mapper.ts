import { ApiBalance } from '../../../base/types';
import { EthereumBalance, EthereumTransaction } from '../../../blockchains/ethereum/types';
import { AlchemyBalance, AlchemyResult, AlchemyTransaction } from './alchemy-ethereum-types';

export const mapAlchemyBalance = (balance: ApiBalance<AlchemyBalance>): EthereumBalance => {
  if (balance.error) throw new Error(balance.error);

  return {
    value: Number.parseInt(balance.result, 16),
  };
};

export const mapAlchemyTransactions = (transaction: AlchemyTransaction[]): EthereumTransaction[] => {
  const transactions = transaction
    .map(throwIfError)
    .flatMap(apiResult => apiResult.result.transfers)
    .sort((a, b) => Number.parseInt(b.blockNum, 16) - Number.parseInt(a.blockNum, 16));

  return transactions.map(transaction => ({ ...transaction, value: ethToGwei(transaction.value) }));
};

export const mapAlchemyResult = <T>(response: AlchemyResult<T>): T => {
  if (response.error) throwAlchemyError(response);
  return response.result;
};

export const mapAlchemyResultToString = (response: AlchemyResult<string>): string => {
  if (response.error) throwAlchemyError(response);

  return response.result;
};

export const ethToGwei = (eth: number): number => eth * 1000000000;
export const weiToGwei = (wei: number): number => wei / 1000000000;

const throwIfError = (res: AlchemyResult<any>): AlchemyResult<any> => {
  if (res.error) throwAlchemyError(res);

  return res;
};

const throwAlchemyError = (result: AlchemyResult<any>): void => {
  throw new Error(JSON.stringify(result.error));
};
