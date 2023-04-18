import { BitcoinEndpoints } from '../../../blockchains/bitcoin/types';

const url = 'https://api-eu1.tatum.io/v3';

// TODO Deal with different Blockchains e.g. what if /btc/ should be /eth/
export const tatumEndpoints: BitcoinEndpoints = {
  balance: function(address: string): string {
    return url + '/bitcoin/address/balance/' + address;
  },
  transactions: function(address: string, query: URLSearchParams): string {
    return `${url}/bitcoin/transaction/address/${address}?${query.toString()}`;
  },
  utxo: function(transactionHash: string, index: number): string {
    return url + '/bitcoin/utxo/' + transactionHash + '/' + index;
  },
  fees: function(): string {
    return url + '/blockchain/estimate';
  },
  broadcastTransaction: function(): string {
    return url + '/bitcoin/broadcast';
  },
};
