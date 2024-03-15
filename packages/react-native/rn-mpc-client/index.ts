import { DeriveFrom, ShareResult, SignWithShare } from '@superlight-labs/mpc-common';
import {
  InProgressStep,
  NoStepDeriveResult,
  SuccessfulStep,
} from '@superlight-labs/rn-crypto-mpc/src/types';
import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/create-secret';
import { deriveBip32, startDerive } from './src/handlers/derive';
import { deriveBip32WithSteps, startDeriveWithSteps } from './src/handlers/derive-hardened';
import { importGenericSecret, startImportGenericSecret } from './src/handlers/import-secret';
import { signEcdsa, startSign } from './src/handlers/sign-ecdsa';
import { authWebsocket, authWebsocketWithSetup } from './src/lib/http-websocket/ws-client';
import { Signer } from './src/lib/http-websocket/ws-common';
export { getPublicKey, getXPubKey } from './src/lib/mpc/mpc-neverthrow-wrapper';
export type { Signer };

export const useGenericSecret = () => ({
  generateGenericSecret: ({ baseUrl, sign }: ActionConfig) =>
    authWebsocket(baseUrl, sign)<ShareResult, SuccessfulStep>(
      startGenerateGenericSecret,
      generateGenericSecret
    ),
  importGenericSecret: ({ baseUrl, sign }: ActionConfig, hexSeed: string) =>
    authWebsocketWithSetup(
      baseUrl,
      sign,
      hexSeed
    )<ShareResult>(startImportGenericSecret, importGenericSecret),
});

export const useDerive = () => ({
  deriveMasterPair: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveMaster) =>
    authWebsocketWithSetup<DeriveFrom, InProgressStep>(baseUrl, sign, {
      ...deriveConfig,
      hardened: false,
      index: 'm',
    })<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
  deriveBip32: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, NoStepDeriveResult>(baseUrl, sign, {
      ...deriveConfig,
      hardened: false,
    })<ShareResult>(startDerive, deriveBip32),
  deriveBip32Hardened: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, InProgressStep>(baseUrl, sign, {
      ...deriveConfig,
      hardened: true,
    })<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
});

export const useSignEcdsa = () => ({
  signEcdsa: ({ baseUrl, sign }: ActionConfig, signConfig: SignWithShare) =>
    authWebsocketWithSetup<SignWithShare, null>(baseUrl, sign, signConfig)(startSign, signEcdsa),
});

type ActionConfig = {
  baseUrl: string;
  sign: Signer;
};

type DeriveMaster = {
  peerShareId: string;
  share: string;
};
