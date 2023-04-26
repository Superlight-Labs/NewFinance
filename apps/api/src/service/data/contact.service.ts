import { RouteError, other } from '@lib/routes/rest/rest-error';
import { ResultAsync } from 'neverthrow';
import { Contact } from 'src/repository/contact';
import { createContact, readAllContacts, readContacts } from 'src/repository/contact.repository';

export const createNewContact = (request: Contact): ResultAsync<Contact, RouteError> => {
  return ResultAsync.fromPromise(createContact(request), e =>
    other('Err while creating contact', e)
  );
};

export const getContacts = (
  userAddress: string,
  peerAddress?: string
): ResultAsync<Contact[], RouteError> => {
  const contacts = ResultAsync.fromPromise(readContacts(userAddress, peerAddress), e =>
    other('Err while reading contacts', e)
  );

  return contacts;
};

export const getAllContacts = (): ResultAsync<Contact[], RouteError> => {
  return ResultAsync.fromPromise(readAllContacts(), e => other('Err while reading contacts', e));
};
