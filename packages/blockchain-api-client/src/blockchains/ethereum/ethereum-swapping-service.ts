import { ApiSwapQuote, Network } from '../../base/types';
import { zeroExEthereumFetcher } from '../../provider/0x/ethereum/0x-ethereum-fetcher';
import { mapZeroExSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-mapper';
import { ZeroExSwapQuote } from '../../provider/0x/ethereum/0x-ethereum-types';

export enum EthereumSwappingProviderEnum {
  ZeroEx,
}

export class EthereumSwappingService {
  private network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  getSwapQuote = async (params: string, provider: EthereumSwappingProviderEnum): Promise<ZeroExSwapQuote> => {
    const { fetcher, mapper } = this.getFunctions(provider, this.network);

    const apiResult = fetcher.fetchSwapQuote(params);

    return (mapper as any).responseToSwapQuote(apiResult as ApiSwapQuote);
  };

  private getFunctions = (provider: EthereumSwappingProviderEnum, network: Network) => {
    switch (provider) {
      default:
        return this.zeroEx(network);
    }
  };

  private zeroEx = (network: Network) => ({
    fetcher: zeroExEthereumFetcher(network),
    mapper: {
      responseToSwapQuote: (input: ApiSwapQuote) => mapZeroExSwapQuote(input as ZeroExSwapQuote),
    },
  });
}
