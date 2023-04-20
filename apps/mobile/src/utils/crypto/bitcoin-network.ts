import { Network } from '@superlight-labs/blockchain-api-client';
import { networks } from 'der-bitcoinjs-lib';

export const getBitcoinJsNetwork = (network: Network): networks.Network => {
  if (network === 'main') {
    return networks.bitcoin;
  }

  return networks.testnet;
};
