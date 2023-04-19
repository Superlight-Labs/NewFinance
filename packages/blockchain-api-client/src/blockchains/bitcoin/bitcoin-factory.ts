import { HttpMethod } from '../../base/http';
import {
  ApiBalance,
  ApiBroadcastTransaction,
  ApiFees,
  ApiTransaction,
  Network,
} from '../../base/types';
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
import { BitcoinProvider, BitcoinSendToAddress } from './types';

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
      default:
        return this.tatum;
    }
  };

  private tatum: BitcoinProvider = {
    fetcher: {
      fetchBalance: (address: string) =>
        fetchFromTatum<TatumBalance>(tatumEndpoints.balance(address), this.network),
      fetchTransactions: (address: string, query: URLSearchParams) =>
        fetchFromTatum<TatumTransaction[]>(
          tatumEndpoints.transactions(address, query),
          this.network
        ),
      fetchFees: (fromAddress: string[], to: BitcoinSendToAddress[]) =>
        fetchFromTatum<TatumFees>(tatumEndpoints.fees(), this.network, {
          method: HttpMethod.POST,
          body: { chain: 'BTC', type: 'TRANSFER', fromAddress, to },
        }),
      sendBroadcastTransaction: (txData: string) =>
        fetchFromTatum<TatumBroadcastTransaction>(
          tatumEndpoints.broadcastTransaction(),
          this.network,
          {
            method: HttpMethod.POST,
            body: { txData: txData },
          }
        ),
      fetchExchangeRate: () => fetchFromTatum(tatumEndpoints.exchangeRate(), this.network),
    },
    mapper: {
      responseToTransactions: (input: ApiTransaction) =>
        mapTatumTransactions(input as TatumTransaction[]),
      responseToBalance: (input: ApiBalance) => mapTatumBalance(input as TatumBalance),
      responseToFees: (input: ApiFees) => mapTatumFees(input as TatumFees),
      responseToBroadcastTransaction: (input: ApiBroadcastTransaction) =>
        mapTatumBroadcastTransaction(input as TatumBroadcastTransaction),
    },
  };
}
