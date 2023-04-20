export type ShareResult = {
  share: string;
  peerShareId: string;
};

export type DeriveFrom = {
  share: string;
  peerShareId: string;
  parentPath?: string;
  index: string;
  hardened: boolean;
};

export type SignWithShare = {
  share: string;
  peerShareId: string;
  messageToSign: string;
  encoding: BufferEncoding;
};
