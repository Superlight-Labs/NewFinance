export interface Contact {
  address: string;
  name: string;
  interaction?: 'send' | 'receive';
}

export interface GetContactRequest {
  address: string;
}

export interface CreateTransactionRequest {
  hash: string;
  reciever: Contact;
  amount: number;
  note?: string;
}

export interface Transaction {
  hash: string;
  recieverAddress: string;
  amount: number;
  note: string | null;
}
