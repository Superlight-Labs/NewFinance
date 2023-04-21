import type { AddressInfo } from 'state/bitcoin.state';

export type WalletTabList = {
  Recieve: { account: string };
  Overview: { account: string };
  Send: { account: string };
};

export type WalletStackList = {
  SendTo: { sender: AddressInfo };
  SendReview: {
    sender: AddressInfo;
    toAddress: string;
    note: string;
    amount: string;
    rate: number;
  };
  SendAmount: { sender: AddressInfo; toAddress: string; note: string };
};
