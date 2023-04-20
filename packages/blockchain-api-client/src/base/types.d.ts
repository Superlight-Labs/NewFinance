import { BitcoinProvider } from '../blockchains/bitcoin/types';
import {
  AlchemyBalance,
  AlchemyBroadCastTransactionResult,
  AlchemyFees,
  AlchemyTokenBalances,
  AlchemyTransaction,
  AlchemyTransactionCount,
} from '../provider/alchemy/ethereum/alchemy-ethereum-types';
import {
  TatumBalance,
  TatumBroadcastTransaction,
  TatumFees,
  TatumTransaction,
} from '../provider/tatum/bitcoin/tatum-bitcoin-types';

export type Provider = BitcoinProvider;

export type ApiBalance<T = BlockCypherBalance | TatumBalance | AlchemyBalance> = T;
export type ApiTransaction<T = BlockCypherBalanceFull | TatumTransaction[] | AlchemyTransaction[]> =
  T;
export type ApiFees<T = BlockCyperFees | TatumFees | AlchemyFees> = T;
export type ApiBroadcastTransaction<
  T = BlockCypherTransaction | TatumBroadcastTransaction | AlchemyBroadCastTransactionResult
> = T;
export type ApiTransactionCount<T = AlchemyTransactionCount> = T;
export type ApiTokenBalances<T = AlchemyTokenBalances> = T;
export type ApiSwapQuote<T = ZEroExSwapQuote> = T;

export interface TransactionRequest {}

export type Network = 'main' | 'test';
export type Chain = 'Ethereum' | 'Polygon';

export interface Input {
  prevout: Prevout;
  sequence: number;
  script: string;
  scriptType: string;
  coin: Coin;
}

export interface Coin {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
}

export interface Prevout {
  hash: string;
  index: number;
}

export interface Output {
  value: number;
  script: string;
  address: string;
}

export interface WalletConfig {
  symbol: string;
  name: null | string;
  chain: string;
  isTestnet: boolean;
}

export interface UTXO {
  version: number;
  height: number;
  value: number;
  script: string;
  address: string;
  coinbase: boolean;
  hash: string;
  index: number;
}

export interface Fees {
  fast: number;
  medium: number;
  slow: number;
}

export interface BroadcastTransaction {
  txId: string;
  failed: boolean;
}

export interface ExchangeRate {
  id: string;
  value: string;
  basePair: string;
  timestamp: number;
  source: string;
}
