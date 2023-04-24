import type { AddressInfo, Addresses } from 'state/bitcoin.state';

export type WalletTabList = {
  Recieve: { external: AddressInfo };
  Overview: { addresses: Addresses; account: string };
  Send: { external: AddressInfo };
};

export type WalletStackList = {
  SendTo: { sender: AddressInfo; recipient?: string };
  SendReview: {
    sender: AddressInfo;
    toAddress: string;
    note: string;
    amount: string;
    rate: number;
  };
  SendAmount: { sender: AddressInfo; toAddress: string; note: string };
  ScanQrCode: { sender: AddressInfo };
};
