import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/create-secret';
import { importGenericSecret, startImportGenericSecret } from './src/handlers/import-secret';
import { ShareResult } from './src/lib/mpc/mpc-types';
import { authWebsocket } from './src/lib/websocket/ws-client';
import { Signer } from './src/lib/websocket/ws-common';
import { authWebsocketWithSetup } from './src/lib/websocket/ws-setup-client';
export type { Signer };

export const useGenericSecret = () => ({
  generateGenericSecret: (baseUrl: string, sign: Signer) =>
    authWebsocket({ baseUrl, socketEndpoint: 'generateGenericSecret' }, sign)<ShareResult>(
      startGenerateGenericSecret,
      generateGenericSecret
    ),
  importGenericSecret: (baseUrl: string, sign: Signer, hexSeed: string) =>
    authWebsocketWithSetup(
      { baseUrl, socketEndpoint: 'importGenericSecret' },
      sign,
      hexSeed
    )<ShareResult>(startImportGenericSecret, importGenericSecret),
});
