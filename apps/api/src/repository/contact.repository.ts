import { notFound, other } from '@lib/routes/rest/rest-error';
import { client } from '@superlight-labs/database';
import { Contact } from './contact';

export const createContact = async (request: Contact): Promise<Contact> => {
  const contact = await client.contact.create({
    data: { ...request },
  });

  if (!contact) throw other('Error while creating Contact');

  return contact;
};

export const readContact = async (address: string): Promise<Contact> => {
  const contact = await client.contact.findUnique({ where: { address } });

  if (!contact) throw notFound('Could not find contact');

  return contact;
};

export const readContacts = async (): Promise<Contact[]> => {
  const contacts = await client.contact.findMany();

  return contacts;
};
