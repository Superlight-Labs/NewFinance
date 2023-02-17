/**
 * Deriving a wallet based on previous seed
 */

import { initDeriveBIP32, step } from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const deriveBIP32 = (
  share: string,
  index: number,
  hardened: boolean
): Promise<string> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/derive');

    ws.onopen = () => {
      initDeriveBIP32(share, index, hardened).then((success) => {
        console.log('starting steps for derive');
        success && step(null).then((stepMsg) => ws.send(stepMsg.message));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      console.log('derive messag from server');
      step(message.data).then((stepMsg) => {
        ws.send(stepMsg.message);

        stepMsg.finished && stepMsg.context && res(stepMsg.context);
      });
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };
  });
};
