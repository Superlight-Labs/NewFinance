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
