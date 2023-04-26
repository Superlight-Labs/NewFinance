export interface Transaction {
  hash: string;
  recieverAddress: string;
  amount: number;
  note: string | null;
}
