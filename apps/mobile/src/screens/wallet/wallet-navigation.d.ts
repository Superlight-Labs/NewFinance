export type WalletTabList = {
  Recieve: undefined;
  Overview: undefined;
  Send: undefined;
};

export type WalletStackList = {
  SendTo: undefined;
  SendReview: undefined;
  SendAmount: { toAddress: string; note: string };
};
