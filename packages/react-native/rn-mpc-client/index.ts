import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/generic-secret';
import { Signer, authWebsocket } from './src/lib/websocket/websocket-client';
export type { Signer };

export const useGenerateGenericSecret = () => ({
  generateGenericSecret: (baseUrl: string, sign: Signer) =>
    authWebsocket({ baseUrl, socketEndpoint: 'generateGenericSecret' }, sign)(
      startGenerateGenericSecret,
      generateGenericSecret
    ),
});
