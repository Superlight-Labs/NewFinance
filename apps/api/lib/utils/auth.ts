import { invalidAuthentication, other, RouteError } from "@lib/route/error";
import { createDecipheriv } from "crypto";
import { FastifyRequest } from "fastify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { User } from "../../routes/user/user";
import { readUser } from "../../routes/user/user.repository";
import { verifySignature } from "./crypto";
import { getSafeResultAsync } from "./neverthrow";

export const buildPubKey = (encoded: string) => {
  // Beginning public key execution
  const l1 = "-----BEGIN PUBLIC KEY-----\n";

  // Finishing public key execution
  const l3 = "\n-----END PUBLIC KEY-----";

  // concatenating all public keys
  return l1 + encoded + l3;
};

export const isNonceValid = (nonce: string | null) => nonce && nonce.length === 24;

export const authenticate = (req: FastifyRequest): ResultAsync<User, RouteError> => {
  const { devicesignature, devicepublickey, userid } = req.headers;

  const signedNonce = req.cookies["authnonce"];
  const nonce = req.unsignCookie(signedNonce || "").value || "";

  if (!isAuthRequestValid(devicesignature as string, devicepublickey as string, userid as string, nonce)) {
    return errAsync(invalidAuthentication("Invalid Request to Secured Endpoint"));
  }

  const readUserResult = getSafeResultAsync(
    readUser({
      userId: userid as string,
      devicePublicKey: devicepublickey as string,
    }),
    (e) => other("Error while reading User from Database", e)
  );

  return readUserResult.andThen((user) => verifyUserSignature(user, nonce, devicesignature as string));
};

const verifyUserSignature = (user: User, nonce: string, deviceSignature: string): ResultAsync<User, RouteError> => {
  const valid = verifySignature(user.devicePublicKey, nonce, deviceSignature);

  if (valid) return okAsync(user);

  return errAsync(invalidAuthentication("Signature invalid"));
};

const isAuthRequestValid = (deviceSignature: string, devicePublicKey: string, userid: string, nonce: string | null) => {
  return (
    isNonceValid(nonce) &&
    isDeviceSignatureValid(deviceSignature) &&
    isDevicePublicKeyValid(devicePublicKey) &&
    isUserIdValid(userid)
  );
};

const isDeviceSignatureValid = (deviceSignature: string | null) => deviceSignature && deviceSignature.length === 96;

const isDevicePublicKeyValid = (devicePublicKey: string | null) => devicePublicKey && devicePublicKey.length === 124;

const isUserIdValid = (userId: string | null) => userId && userId.length === 36;

const algorithm = "aes256";
const inputEncoding = "utf8";
const outputEncoding = "hex";

export const decryptCipher = (key: Buffer, cipherText: string): unknown => {
  const components = cipherText.split(":");
  const iv_from_ciphertext = Buffer.from(components.shift() || "", outputEncoding);
  const decipher = createDecipheriv(algorithm, key, iv_from_ciphertext);
  let deciphered = decipher.update(components.join(":"), outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);

  return JSON.parse(deciphered);
};
