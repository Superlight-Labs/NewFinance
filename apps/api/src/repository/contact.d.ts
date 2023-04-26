export interface Contact {
  address: string;
  name: string;
  interaction?: 'send' | 'receive';
}

export interface GetContactRequest {
  address: string;
}
