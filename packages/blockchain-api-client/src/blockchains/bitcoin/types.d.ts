import { BitcoinMapper } from './bitcoin-mapper';

export interface BitcoinBalance {
  incoming: number;
  outgoing: number;
  unconfirmedBalance?: number;
  confirmedBalance?: number;
}

export interface BitcoinTransaction {
  blockNumber: number;
  fee: number;
  hash: string;
  hex: string;
  index: number;
  inputs: Input[];
  locktime: number;
  outputs: Output[];
  size: number;
  time: number;
  version: number;
  vsize: number;
  witnessHash: string;
  total: number | undefined;
}

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

export interface BitcoinProvider {
  fetcher: any;
  mapper: BitcoinMapper;
}

export interface BitcoinEndpoints {
  balance: (...args: any) => string;
  transactions: (...args: any) => string;
  utxo: (...args: any) => string;
  fees: (...args: any) => string;
  broadcastTransaction: (...args: any) => string;
}
