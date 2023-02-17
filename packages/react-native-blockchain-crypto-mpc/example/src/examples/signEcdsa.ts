import { Buffer } from 'buffer';
import { initSignEcdsa, step } from 'react-native-blockchain-crypto-mpc';
import { ActionStatus, getApi } from './shared';

export const signEcdsa = (message: string, share: string): Promise<string> => {
  return new Promise((res) => {
    const ws = new WebSocket(getApi('ws') + '/sign');
    let signStatus: ActionStatus = 'Init';

    ws.onopen = () => {
      ws.send(message);
    };

    ws.onmessage = (wsMessage: WebSocketMessageEvent) => {
      switch (signStatus) {
        case 'Init':
          const msg = JSON.parse(wsMessage.data);

          if (msg.value !== 'Start') {
            return;
          }

          signStatus = 'Stepping';
          initSignEcdsa(
            new Uint8Array(Buffer.from(message, 'base64')),
            share
          ).then((success) => {
            success && step(null).then((stepMsg) => ws.send(stepMsg.message));
          });

          break;
        case 'Stepping':
          step(wsMessage.data).then((stepMsg) => {
            ws.send(stepMsg.message);
            stepMsg.finished && stepMsg.context && res(stepMsg.context);
          });

          break;
      }
    };

    ws.onerror = (error) => {
      console.log('err', error);
    };
  });
};
