export type BlockCypherBalance = {
  total_received: number;
  total_sent: number;
  unconfirmed_balance: number;
  final_balance: number;
  balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
};

export type BlockCypherBalanceFull = {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  txs: BlockCypherTransaction[];
};

export interface BlockCypherTransaction {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  confirmed: Date;
  received: Date;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  confidence: number;
  inputs: BlockCypherInput[];
  outputs: BlockCypherOutput[];
  lock_time: number;
  hex: string | undefined;
  witness_hash: string | undefined;
}

export interface BlockCypherInput {
  prev_hash: string;
  output_index: number;
  script: string;
  output_value: number;
  sequence: number;
  addresses: string[];
  script_type: string;
  age: number;
}

export interface BlockCypherOutput {
  value: number;
  script: string;
  addresses: string[];
  script_type: string;
  spent_by?: string;
}

export interface BlockCyperFees {}
