import { route } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { Contact } from 'src/repository/contact';
import { createNewContact, getAllContacts, getContacts } from 'src/service/data/contact.service';

export const registerContactRoutes = (server: FastifyInstance) => {
  server.post('/contact/create', { schema: createContactSchema }, postCreateContact);
  server.get('/contact/:userAddress', { schema: readContactsSchema }, getReadContacts);
  server.get('/contact', getReadAllUsers);
};

const postCreateContact = route<Contact>((req: FastifyRequest) => {
  return createNewContact(req.body as Contact);
});

const getReadContacts = route<Contact[]>((req: FastifyRequest) => {
  const params = req.params as any;
  const query = req.query as any;

  const peerAddress = query.peerAddress;

  return getContacts(params.userAddress, peerAddress);
});

const getReadAllUsers = route<Contact[]>(_ => {
  return getAllContacts();
});

const readContactsSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['userAddress'],
    properties: {
      userAddress: { type: 'string', maxLength: 64, minLength: 32 },
    },
  },
  querystring: {
    type: 'object',
    properties: {
      peerAddress: { type: 'string', maxLength: 64 },
    },
  },
};

const createContactSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['address', 'name'],
    properties: {
      address: { type: 'string', maxLength: 64, minLength: 32 },
      name: { type: 'string', maxLength: 130 },
    },
  },
};
