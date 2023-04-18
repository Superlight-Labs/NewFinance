import { EthereumTokenBalances } from '../../../blockchains/ethereum/types';

export type AlchemyResult<T> = {
  jsonrpc: string;
  id: number;
  result: T;
  error?: string;
};

export type AlchemyBalance = AlchemyResult<string>;
export type AlchemyTransaction = AlchemyResult<AlchemyTransactionResult>;
export type AlchemyFees = AlchemyResult<string>;
export type AlchemyBroadCastTransaction = AlchemyResult<string>;
export type AlchemyTransactionCount = AlchemyResult<string>;
export type AlchemyTokenBalances = AlchemyResult<EthereumTokenBalances>;

export interface AlchemyTransactionResult {
  transfers: Transaction[];
}

interface Transaction {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: null;
  erc1155Metadata: null;
  tokenId: null;
  asset: string;
  category: string;
  rawContract: RawContract;
}

interface RawContract {
  value: string;
  address: null;
  decimal: string;
}
