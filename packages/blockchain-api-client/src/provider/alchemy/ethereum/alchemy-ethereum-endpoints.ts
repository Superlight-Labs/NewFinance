import { Chain, Network } from '../../../base/types';

export const alchemyEndpoints = (network: Network, chain: Chain): string => {
  return `https://${urls[network][chain]}.alchemyapi.io/v2/`;
};

const urls = {
  TEST: {
    Ethereum: 'eth-goerli',
    Polygon: 'polygon-mumbai.g',
  },
  MAIN: {
    Ethereum: 'eth-mainnet',
    Polygon: 'polygon-mainnet.g',
  },
};
