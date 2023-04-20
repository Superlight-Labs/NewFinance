import { Network } from '../../../base/types';
import { fetchFromZeroEx } from '../http';
import { zeroExEndpoints } from './0x-ethereum-endpoints';
import { ZeroExSwapQuote } from './0x-ethereum-types';

export const zeroExEthereumFetcher = (network: Network) => ({
  fetchSwapQuote: (params: string) => fetchFromZeroEx<ZeroExSwapQuote>(zeroExEndpoints(network).swapQuote(params)),
});
