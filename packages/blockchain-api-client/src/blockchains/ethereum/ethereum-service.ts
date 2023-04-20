import { ApiBroadcastTransaction, ApiTokenBalances, ApiTransactionCount, Chain, Network } from '../../base/types';
import { EthereumFactory, EthereumProviderEnum } from './ethereum-factory';
import { EthereumBalance, EthereumTokenBalances, EthereumTransaction } from './types';

export class EthereumService {
  private factory: EthereumFactory;

  constructor(network: Network, chain: Chain = 'Ethereum') {
    this.factory = new EthereumFactory(network, chain);
  }

  /**
   *
   * @param address Address of the KeyPair of which we want to know the balance from
   * @param provider Which API should be called
   * @returns
   */
  getBalance = async (address: string, provider: EthereumProviderEnum): Promise<EthereumBalance> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiBalance = await fetcher.fetchBalance(address);

    return mapper.responseToBalance(apiBalance);
  };

  /**
   *
   * @param address Address of the KeyPair of which transactions should be fetched
   * @param query Query Parameters for 3rd Party API
   * TATUM: https://apidoc.tatum.io/tag/Ethereum#operation/BtcGetTxByAddress
   * BLOCKCYPHER: https://www.blockcypher.com/dev/Ethereum/#address-full-endpoint
   * @param provider Which API should be called
   * @returns
   */
  getTransactions = async (address: string, provider: EthereumProviderEnum): Promise<EthereumTransaction[]> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiTransactions = await fetcher.fetchTransactions(address);

    return mapper.responseToTransactions(apiTransactions);
  };

  getERC20Transactions = async (address: string, provider: EthereumProviderEnum): Promise<EthereumTransaction[]> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiTransactions = await fetcher.fetchERC20Transactions(address);

    return mapper.responseToTransactions(apiTransactions);
  };

  getFees = async (provider: EthereumProviderEnum): Promise<string> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiFees = fetcher.fetchFees && (await fetcher.fetchFees());

    return mapper.responseToFees(apiFees);
  };

  sendRawTransaction = async (transaction: string, provider: EthereumProviderEnum): Promise<string> => {
    const { fetcher, mapper } = this.factory.getProviderFunctions(provider);

    const apiResult = fetcher.sendRawTransaction && (await fetcher.sendRawTransaction(transaction));

    return mapper.responseToBroadcastTransaction(apiResult as ApiBroadcastTransaction);
  };

  getTransactionCount = async (address: string, provider: EthereumProviderEnum): Promise<string> => {
    const { fetcher, mapper } = this.factory.getProviderFunctions(provider);

    const apiResult = fetcher.fetchTransactionCount && (await fetcher.fetchTransactionCount(address));

    return mapper.responseToTransactionCount(apiResult as ApiTransactionCount);
  };

  getEstimatedFees = async (
    from: string,
    to: string,
    data: string,
    provider: EthereumProviderEnum
  ): Promise<string> => {
    const { mapper, fetcher } = this.factory.getProviderFunctions(provider);

    const apiFees = fetcher.fetchEstimatedGas && (await fetcher.fetchEstimatedGas(from, to, data));

    return mapper.responseToFees(apiFees);
  };

  getTokenBalances = async (
    address: string,
    contractAddresses: string[],
    provider: EthereumProviderEnum
  ): Promise<EthereumTokenBalances> => {
    const { fetcher, mapper } = this.factory.getProviderFunctions(provider);

    const apiResult = fetcher.fetchTokenBalances && (await fetcher.fetchTokenBalances(address, contractAddresses));

    return mapper.responseToTokenBalances(apiResult as ApiTokenBalances);
  };
}
