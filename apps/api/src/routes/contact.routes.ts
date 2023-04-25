import { route } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { Contact } from 'src/repository/contact';
import { createNewContact, getAllContacts, getContact } from 'src/service/data/contact.service';

export const registerContactRoutes = (server: FastifyInstance) => {
  server.post('/contact/create', { schema: createContactSchema }, postCreateContact);
  server.get('/contact/:address', { schema: readSingleContactSchema }, getSingleContact);
  server.get('/contact', getReadAllUsers);
};

const postCreateContact = route<Contact>((req: FastifyRequest) => {
  return createNewContact(req.body as Contact);
});

const getSingleContact = route<Contact>((req: FastifyRequest) => {
  const params = req.params as any;
  return getContact(params.address);
});

const getReadAllUsers = route<Contact[]>(_ => {
  return getAllContacts();
});

const readSingleContactSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['address'],
    properties: {
      address: { type: 'string', maxLength: 35, minLength: 26 },
    },
  },
};

const createContactSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['address', 'name'],
    properties: {
      address: { type: 'string', maxLength: 35, minLength: 26 },
      name: { type: 'string', maxLength: 130 },
    },
  },
};
