import { initGenerateEcdsaKey, step } from 'react-native-blockchain-crypto-mpc';
import { getApi } from './shared';

export const generateEcdsa = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(getApi('ws') + '/init');

    ws.onopen = () => {
      console.log('Start generate ecdsa key');
      initGenerateEcdsaKey().then((success) => {
        if (success)
          step(null).then((stepMsg) => {
            ws.send(stepMsg.message);
          });
      });
    };

    ws.onmessage = (message: WebSocketMessageEvent) => {
      step(message.data).then((stepMsg) => {
        ws.send(stepMsg.message);

        stepMsg.finished && stepMsg.share && resolve(stepMsg.share);
      });
    };

    ws.onerror = (error) => {
      reject(error);
    };
  });
};
