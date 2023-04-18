import { HttpMethod } from '../../base/http';
import { ApiBalance, ApiBroadcastTransaction, ApiFees, ApiTransaction, Network } from '../../base/types';
import { blockCypherEndpoints } from '../../provider/blockcypher/bitcoin/blockcypher-bitcoin-endpoints';
import {
  mapBlockCypherBalance,
  mapBlockCypherBroadcastTransaction,
  mapBlockCypherFees,
  mapBlockCypherTransactions,
} from '../../provider/blockcypher/bitcoin/blockcypher-bitcoin-mapper';
import {
  BlockCyperFees,
  BlockCypherBalance,
  BlockCypherBalanceFull,
  BlockCypherTransaction,
} from '../../provider/blockcypher/bitcoin/blockcypher-bitcoin-types';
import { fetchFromBlockCypher } from '../../provider/blockcypher/http';
import { tatumEndpoints } from '../../provider/tatum/bitcoin/tatum-bitcoin-endpoints';
import {
  mapTatumBalance,
  mapTatumBroadcastTransaction,
  mapTatumFees,
  mapTatumTransactions,
} from '../../provider/tatum/bitcoin/tatum-bitcoin-mapper';
import {
  TatumBalance,
  TatumBroadcastTransaction,
  TatumFees,
  TatumTransaction,
} from '../../provider/tatum/bitcoin/tatum-bitcoin-types';
import { fetchFromTatum } from '../../provider/tatum/http';
import { BitcoinProvider } from './types';

export enum BitcoinProviderEnum {
  TATUM,
  BLOCKCYPHER,
}

export class BitcoinFactory {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }
  getProviderFunctions = (provider: BitcoinProviderEnum): BitcoinProvider => {
    switch (provider) {
      case BitcoinProviderEnum.TATUM:
        return this.tatum;

      case BitcoinProviderEnum.BLOCKCYPHER:
        return this.blockCypher;

      default:
        return this.tatum;
    }
  };

  private blockCypher: BitcoinProvider = {
    fetcher: {
      fetchBalance: (address: string) =>
        fetchFromBlockCypher<BlockCypherBalance>(blockCypherEndpoints(this.network).balance(address)),
      fetchTransactions: (address: string, query: URLSearchParams) =>
        fetchFromBlockCypher<BlockCypherBalanceFull>(blockCypherEndpoints(this.network).transactions(address, query)),
      fetchFees: (chain: string, type: string, fromUTXO: any[], to: any[]) =>
        fetchFromBlockCypher<BlockCyperFees>(blockCypherEndpoints(this.network).fees(), {
          method: HttpMethod.POST,
          body: { chain, type, fromUTXO, to },
        }),
      sendBroadcastTransaction: (txData: string) =>
        fetchFromBlockCypher<BlockCypherTransaction>(blockCypherEndpoints(this.network).broadcastTransaction(), {
          method: HttpMethod.POST,
          body: { tx: txData },
        }),
    },
    mapper: {
      responseToBalance: (input: ApiBalance) => mapBlockCypherBalance(input as BlockCypherBalance),
      responseToTransactions: (input: ApiTransaction) => mapBlockCypherTransactions(input as BlockCypherBalanceFull),
      responseToFees: (input: ApiFees) => mapBlockCypherFees(input as BlockCyperFees),
      responseToBroadcastTransaction: (input: ApiBroadcastTransaction) =>
        mapBlockCypherBroadcastTransaction(input as BlockCypherTransaction),
    },
  };

  private tatum: BitcoinProvider = {
    fetcher: {
      fetchBalance: (address: string) => fetchFromTatum<TatumBalance>(tatumEndpoints.balance(address), this.network),
      fetchTransactions: (address: string, query: URLSearchParams) =>
        fetchFromTatum<TatumTransaction[]>(tatumEndpoints.transactions(address, query), this.network),
      fetchFees: (chain: string, type: string, fromUTXO: any[], to: any[]) =>
        fetchFromTatum<TatumFees>(tatumEndpoints.fees(), this.network, {
          method: HttpMethod.POST,
          body: { chain, type, fromUTXO, to },
        }),
      sendBroadcastTransaction: (txData: string) =>
        fetchFromTatum<TatumBroadcastTransaction>(tatumEndpoints.broadcastTransaction(), this.network, {
          method: HttpMethod.POST,
          body: { txData: txData },
        }),
    },
    mapper: {
      responseToTransactions: (input: ApiTransaction) => mapTatumTransactions(input as TatumTransaction[]),
      responseToBalance: (input: ApiBalance) => mapTatumBalance(input as TatumBalance),
      responseToFees: (input: ApiFees) => mapTatumFees(input as TatumFees),
      responseToBroadcastTransaction: (input: ApiBroadcastTransaction) =>
        mapTatumBroadcastTransaction(input as TatumBroadcastTransaction),
    },
  };
}
