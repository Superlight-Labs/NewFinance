import { MpcKeyShare } from './key-share';

export interface User {
  id: string;
  devicePublicKey: string;
  keyShares: MpcKeyShare[];
  username: string;
  email: string;
  deriveContext: Buffer | null;
}

export interface CreateUserResponse {
  nonce: string;
  userId: string;
}

export interface VerifyUserRequest {
  userId: string;
  message: string;
  signature: string;
  devicePublicKey: string;
}

export interface UpdateUserWalletByPathRequest {
  path: string;
  address: string;
}

export type GetUserRequest = {
  userId: string;
  devicePublicKey: string;
};
