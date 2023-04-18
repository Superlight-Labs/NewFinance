export interface ZeroExSwapQuote {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources?: SourcesEntity[] | null;
  orders?: OrdersEntity[] | null;
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
}
export interface SourcesEntity {
  name: string;
  proportion: string;
}
export interface OrdersEntity {
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  fillData: FillData;
  source: string;
  sourcePathId: string;
  type: number;
}
export interface FillData {
  tokenAddressPath?: string[] | null;
  router: string;
}
