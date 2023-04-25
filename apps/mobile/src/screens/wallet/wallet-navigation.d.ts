import { Contact } from '@superlight-labs/api/src/repository/contact';
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
    contact?: Contact;
  };
  SendAmount: {
    sender: AddressInfo;
    toAddress: string;
    note: string;
    contact?: Contact & { new: boolean };
  };
  ScanQrCode: { sender: AddressInfo };
};
