import { DeriveConfig } from '@superlight/mpc-common';
import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/create-secret';
import { deriveBip32, startDerive } from './src/handlers/derive';
import { deriveBip32Hardened, startDeriveHardened } from './src/handlers/derive-hardened';
import { importGenericSecret, startImportGenericSecret } from './src/handlers/import-secret';
import { DeriveFrom, ShareResult } from './src/lib/mpc/mpc-types';
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

export const useDerive = () => ({
  deriveBip32: (baseUrl: string, sign: Signer, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom & DeriveConfig, null>(
      { baseUrl, socketEndpoint: 'derive/non-hardened' },
      sign,
      {
        ...deriveConfig,
        hardened: false,
      }
    )<ShareResult>(startDerive, deriveBip32),
  deriveBip32Hardened: (baseUrl: string, sign: Signer, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom & DeriveConfig, null>(
      { baseUrl, socketEndpoint: 'derive/hardened' },
      sign,
      {
        ...deriveConfig,
        hardened: true,
      }
    )<ShareResult>(startDeriveHardened, deriveBip32Hardened),
});
