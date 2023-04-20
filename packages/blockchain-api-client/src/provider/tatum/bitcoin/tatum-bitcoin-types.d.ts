export type TatumBalance = {
  incoming: number;
  outgoing: number;
};

export interface TatumTransaction {
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
  weight: number;
  witnessHash: string;
}

interface Output {
  value: number;
  script: string;
  address: string;
}

interface Input {
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

interface Prevout {
  hash: string;
  index: number;
}

export interface TatumBroadcastTransaction {
  txId: string;
  failed: boolean;
}

export interface TatumFees {
  fast: number;
  medium: number;
  slow: number;
}
