import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/create-secret';
import { deriveBip32, startDerive } from './src/handlers/derive';
import { deriveBip32WithSteps, startDeriveWithSteps } from './src/handlers/derive-hardened';
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
  deriveMasterPair: (baseUrl: string, sign: Signer, deriveConfig: DeriveMaster) =>
    authWebsocketWithSetup<DeriveFrom, null>({ baseUrl, socketEndpoint: 'derive/stepping' }, sign, {
      ...deriveConfig,
      hardened: false,
      index: 'm',
    })<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
  deriveBip32: (baseUrl: string, sign: Signer, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, string>(
      { baseUrl, socketEndpoint: 'derive/no-steps' },
      sign,
      {
        ...deriveConfig,
        hardened: false,
      }
    )<ShareResult>(startDerive, deriveBip32),
  deriveBip32Hardened: (baseUrl: string, sign: Signer, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, null>({ baseUrl, socketEndpoint: 'derive/stepping' }, sign, {
      ...deriveConfig,
      hardened: true,
    })<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
});

type DeriveMaster = {
  peerShareId: string;
  share: string;
};
