/**
 * Importing an seed(secret) - CAVE - single point of failure
 *
 * @param {string} secret Conventional seed, here called secret
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  initImportGenericSecret,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const importSecret = (secret: string): Promise<string> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/import');

    ws.onopen = () => {
      ws.send(secret);
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      const msg = JSON.parse(message.data);

      if (msg.value !== 'Start') {
        return;
      }

      initImportGenericSecret(secret).then((success) => {
        success &&
          step(null).then((stepMsg) => {
            ws.send(stepMsg.message);

            stepMsg.finished && stepMsg.share && res(stepMsg.share);
          });
      });
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };
  });
};
