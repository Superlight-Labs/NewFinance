import { other, RouteError } from "@lib/route/error";
import { buildPubKey } from "@lib/utils/auth";
import { getSafeResultAsync } from "@lib/utils/neverthrow";
import crypto from "crypto";
import { okAsync, ResultAsync } from "neverthrow";
import { CreateUserRequest, CreateUserResponse, UpdateUserWalletByPathRequest, User, VerifyUserRequest } from "./user";
import { readUser, readUserKeyShareByPath, saveUser, updateUserKeyShare } from "./user.repository";
import { MpcKeyShare } from "./wallet";

export const createUser = (request: CreateUserRequest, nonce: string): ResultAsync<CreateUserResponse, RouteError> => {
  return ResultAsync.fromPromise(saveUser(request), (e) => other("Err while creating user", e as Error)).map((user) => {
    return {
      nonce,
      userId: user.id,
    };
  });
};

export const verifyUser = (request: VerifyUserRequest, message: string): ResultAsync<boolean, RouteError> => {
  const { deviceSignature } = request;

  const readUserResult = getSafeResultAsync(readUser(request), (e) => other("Error while reading User from DB", e));

  return readUserResult.andThen((user) => {
    const verifier = crypto.createVerify("SHA256").update(message, "utf-8");
    const result = verifier.verify(
      {
        key: buildPubKey(user.devicePublicKey),
        format: "pem",
        type: "pkcs1",
      },
      Buffer.from(deviceSignature, "base64")
    );
    return okAsync(result);
  });
};

export const updateUserWalletAddress = (
  user: User,
  request: UpdateUserWalletByPathRequest
): ResultAsync<MpcKeyShare, RouteError> => {
  const { path, address } = request;
  const readKeyShare = getSafeResultAsync(readUserKeyShareByPath(user, path), (e) =>
    other("Error while reading Key Share for user", e)
  );

  return readKeyShare.andThen((keyShare) => updateKeyShare(keyShare, address));
};

const updateKeyShare = (keyShare: MpcKeyShare, address: string): ResultAsync<MpcKeyShare, RouteError> => {
  return getSafeResultAsync(updateUserKeyShare({ ...keyShare, address }), (e) =>
    other("Error while updating Key Share", e)
  );
};
