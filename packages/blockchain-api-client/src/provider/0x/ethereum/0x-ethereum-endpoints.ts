import { Network } from '../../../base/types';

const mainUrl = 'https://api.0x.org';
const testUrl = 'https://goerli.api.0x.org';

export const zeroExEndpoints = (network: Network) => {
  const networkPath = getNetworkPath(network);

  return {
    swapQuote: function(params: string): string {
      return `${networkPath}/swap/v1/quote?${params}`;
    },
  };
};

const getNetworkPath = (network: Network) => {
  if (network === 'MAIN') return mainUrl;

  if (network === 'TEST') return testUrl;

  return testUrl;
};
