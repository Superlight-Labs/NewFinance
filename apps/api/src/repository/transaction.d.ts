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
