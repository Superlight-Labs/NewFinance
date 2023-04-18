import { fetchFrom } from "../../base/http";

export const fetchFromAlchemy = async <T>(
  url: string,
  method: Method,
  params?: any[]
): Promise<T> => {
  console.log(url, params);
  return fetchFrom(url + apiKey, {
    body: { id: 1, jsonrpc: "2.0", params, method },
  });
};

export enum Method {
  Balance = "eth_getBalance",
  Transactions = "alchemy_getAssetTransfers",
  SendTransaction = "eth_sendRawTransaction",
  GasPrice = "eth_gasPrice",
  TransactionCount = "eth_getTransactionCount",
  EstimateGas = "eth_estimateGas",

  //ERC-20
  TokenBalances = "alchemy_getTokenBalances",
}

const apiKey = "";
