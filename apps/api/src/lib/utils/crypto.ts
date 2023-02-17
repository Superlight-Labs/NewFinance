import crypto from "crypto";
import { buildPubKey } from "./auth";

export const verifySignature = (
  publicKey: string,
  message: string,
  signature: string
): boolean => {
  const verifier = crypto.createVerify("SHA256").update(message, "utf-8");

  return verifier.verify(
    {
      key: buildPubKey(publicKey),
      format: "pem",
      type: "pkcs1",
    },
    Buffer.from(signature, "base64")
  );
};
