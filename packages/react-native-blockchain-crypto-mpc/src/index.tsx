import { Buffer } from 'buffer';
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package 'react-native-blockchain-crypto-mpc' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const BlockchainCryptoMpc = NativeModules.BlockchainCryptoMpc
  ? NativeModules.BlockchainCryptoMpc
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initGenerateGenericSecret(): Promise<boolean> {
  reset();
  return BlockchainCryptoMpc.initGenerateGenericSecret();
}

export function initImportGenericSecret(secret: string): Promise<boolean> {
  reset();
  return BlockchainCryptoMpc.importGenericSecret([
    ...Buffer.from(secret, 'hex'),
  ]);
}

export function initDeriveBIP32(
  share: string,
  index: number,
  hardened: boolean
): Promise<boolean> {
  reset();
  return new Promise(async res => {
    await useShare(share);
    const success = await BlockchainCryptoMpc.initDeriveBIP32(
      index,
      hardened ? 1 : 0
    );
    res(success);
  });
}

export function initGenerateEcdsaKey(): Promise<boolean> {
  reset();

  return BlockchainCryptoMpc.initGenerateEcdsaKey();
}

export function initSignEcdsa(
  message: Uint8Array,
  share: string
): Promise<boolean> {
  reset();

  return new Promise(async res => {
    await useShare(share);
    const success = await BlockchainCryptoMpc.initSignEcdsa(
      Array.from(message)
    );
    res(success);
  });
}

export function step(messageIn: string | null): Promise<StepResult> {
  return BlockchainCryptoMpc.step(messageIn);
}

export function getPublicKey(share: string): Promise<string> {
  return new Promise(async res => {
    await useShare(share);
    const key = await BlockchainCryptoMpc.getPublicKey();
    res(key);

    reset();
  });
}

export function getXPubKey(
  share: string,
  network: 'main' | 'test'
): Promise<string> {
  return new Promise(async res => {
    await useShare(share);
    const key = await BlockchainCryptoMpc.getXPubKey(network === 'main');
    res(key);

    reset();
  });
}

export function getDerSignature(context: string): Promise<string> {
  return new Promise(async res => {
    await useContext(context);
    const signature = await BlockchainCryptoMpc.getDerSignature();
    res(signature);

    reset();
  });
}

type BinSignature = {
  signature: string;
  recoveryCode: number;
};

export function getBinSignature(
  context: string,
  share: string
): Promise<BinSignature> {
  return new Promise(async res => {
    await useContext(context);
    await useShare(share);

    const signature = await BlockchainCryptoMpc.getBinSignature();
    res(signature);

    reset();
  });
}

export function verifySignature(
  message: Uint8Array,
  signature: Uint8Array,
  share: string
): Promise<boolean> {
  return new Promise(async res => {
    await useShare(share);
    const ok = await BlockchainCryptoMpc.verifySignature(
      Array.from(message),
      Array.from(signature)
    );
    res(ok);

    reset();
  });
}

export function getShare(context: string): Promise<string> {
  return new Promise(async res => {
    await useContext(context);
    const share = await BlockchainCryptoMpc.getShare();
    res(share);

    reset();
  });
}

export function getResultDeriveBIP32(context: string): Promise<string> {
  return new Promise(async res => {
    await useContext(context);
    const share = await BlockchainCryptoMpc.getResultDeriveBIP32();
    res(share);

    reset();
  });
}

export function useShare(shareBuf: string): Promise<true> {
  return BlockchainCryptoMpc.useShare(shareBuf);
}

export function useContext(contextBuf: string): Promise<true> {
  return BlockchainCryptoMpc.useContext(contextBuf);
}

export function reset(): Promise<true> {
  return BlockchainCryptoMpc.reset();
}

export type StepResult = {
  finished: boolean;
  message: string;
  share?: string;
  context?: string;
};
