export interface Contact {
  address: string;
  name: string | null;
  userEmail: string | null;
  interaction?: 'send' | 'receive';
}

export interface GetContactRequest {
  address: string;
}
