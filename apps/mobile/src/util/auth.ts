import { generateKeyPair, sign } from "@superlight/rn-secure-encryption-module";
import * as LocalAuthentication from "expo-local-authentication";
import { constants } from "util/constants";


// TODO: use neverthrow for failable stuff

export const createDeviceKey = async (): Promise<string> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate in WalletPOC",
    cancelLabel: "cancel",
  });

  if (!result.success) {
    // Show snackbar here or similar
    throw new Error(result.error);
  }

  return await generateKeyPair(constants.deviceKeyName);
};

export const signWithDeviceKey = async (message: string): Promise<string> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to verify your Device WalletPOC",
    cancelLabel: "cancel",
  });

  if (!result.success) {
    // Show snackbar here or similar
    throw new Error(result.error);
  }

  return await sign(message, constants.deviceKeyName);
};

export const signWithDeviceKeyNoAuth = (message: string): Promise<string> => {
  return sign(message, constants.deviceKeyName);
};
