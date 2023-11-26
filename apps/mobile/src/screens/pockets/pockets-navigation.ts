import { Contact } from '@superlight-labs/api/src/repository/contact';
import { AccountTransaction, AddressInfo } from 'state/bitcoin.state';

export type PocketsStackParamList = {
  Pockets: undefined;
  Wallet: { account: string };

  SetupWallet: undefined;

  CreatePocket: undefined;

  TransactionDetails: {
    transaction: AccountTransaction;
  };

  Receive: { external: AddressInfo };
  Overview: { account: string };
  Send: { external: AddressInfo };
};

export type SendStackList = {
  SendTo: {
    sender: AddressInfo;
    recipient?: string;
    amount: number;
    currency: Currency;
  };
  SendReview: {
    sender: AddressInfo;
    toAddress: string;
    note: string;
    amount: number;
    contact?: Contact;
    currency: Currency;
  };
  SendAmount: {
    sender: AddressInfo;
  };
  ScanQrCode: {
    sender: AddressInfo;
    recipient?: string;
    amount: number;
    currency: Currency;
  };
};
