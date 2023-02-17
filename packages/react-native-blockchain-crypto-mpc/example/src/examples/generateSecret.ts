/**
 * Generating an random MPC seed(secret) for deriving later
 *
 * @param {Function} setSeedShare Function to return the client side seed share
 */

import {
  initGenerateGenericSecret,
  step,
} from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const generateSecret = (): Promise<string> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/secret');

    ws.onopen = () => {
      initGenerateGenericSecret().then((success) => {
        success && step(null).then((stepMsg) => ws.send(stepMsg.message));
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
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
