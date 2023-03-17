import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-secure-encryption-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SecureEncryptionModule = NativeModules.SecureEncryptionModule
  ? NativeModules.SecureEncryptionModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function generateKeyPair(alias: String): Promise<string> {
  return SecureEncryptionModule.generateKeyPair(alias);
}

export function encrypt(clearText: String, keyName: String): Promise<any> {
  return SecureEncryptionModule.encrypt(clearText, keyName);
}

export function decrypt(encryptedText: String, keyName: String): Promise<any> {
  return SecureEncryptionModule.decrypt(encryptedText, keyName);
}

export function sign(message: String, keyName: String): Promise<any> {
  return SecureEncryptionModule.signMessage(message, keyName);
}

export function getKey(alias: string): Promise<string> {
  return SecureEncryptionModule.getKey(alias);
}

export function deleteKeyPair(alias: string): Promise<true> {
  return SecureEncryptionModule.deleteKeyPair(alias);
}

export function verify(
  signature: String,
  message: String,
  keyName: String
): Promise<boolean> {
  return SecureEncryptionModule.verifySignature(signature, message, keyName);
}

export function isKeySecuredOnHardware(keyName: String): Promise<boolean> {
  return SecureEncryptionModule.isKeySecuredOnHardware(keyName);
}
