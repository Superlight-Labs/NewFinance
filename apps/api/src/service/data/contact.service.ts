import { RouteError, other } from '@lib/routes/rest/rest-error';
import { ResultAsync } from 'neverthrow';
import { Contact } from 'src/repository/contact';
import { createContact, readContact, readContacts } from 'src/repository/contact.repository';

export const createNewContact = (request: Contact): ResultAsync<Contact, RouteError> => {
  return ResultAsync.fromPromise(createContact(request), e =>
    other('Err while creating contact', e)
  );
};

export const getContact = (address: string): ResultAsync<Contact, RouteError> => {
  return ResultAsync.fromPromise(readContact(address), e => other('Err while reading contacts', e));
};

export const getAllContacts = (): ResultAsync<Contact[], RouteError> => {
  return ResultAsync.fromPromise(readContacts(), e => other('Err while reading contacts', e));
};
