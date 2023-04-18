import { Network } from '../../../base/types';
import { BitcoinEndpoints } from '../../../blockchains/bitcoin/types';

// TODO Deal with different Blockchains e.g. what if /btc/ should be /eth/
export const blockCypherEndpoints = (network: Network): BitcoinEndpoints => {
  const networkPath = getNetworkPath(network);

  return {
    balance: function(address: string): string {
      return `https://api.blockcypher.com/v1/btc/${networkPath}/addrs/${address}/full`;
    },
    transactions: function(address: string, query: URLSearchParams): string {
      return `https://api.blockcypher.com/v1/btc/${networkPath}/addrs/${address}/full?${query.toString()}`;
    },
    utxo: function(transactionHash: string, index: number): string {
      return `https://api.blockcypher.com/v1/btc/${networkPath}/txs/${transactionHash}/${index}`;
    },
    fees: function(): string {
      return 'https://api.blockcypher.com/v1/btc/' + networkPath;
    },
    broadcastTransaction: function(): string {
      return `https://api.blockcypher.com/v1/btc/${networkPath}/txs/push`;
    },
  };
};

const getNetworkPath = (network: Network) => {
  if (network === 'MAIN') return 'main';

  if (network === 'TEST') return 'test3';

  return 'test3';
};
