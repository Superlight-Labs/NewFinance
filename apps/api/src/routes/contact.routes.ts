import { route } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { Contact, CreateTransactionRequest, Transaction } from 'src/repository/contact';
import {
  createNewContact,
  createNewTransaction,
  getAllContacts,
  getContacts,
} from 'src/service/data/contact.service';

export const registerContactRoutes = (server: FastifyInstance) => {
  server.post(
    '/contact/transaction/create',
    { schema: createTransactionSchema },
    postCreateTransaction
  );
  server.post('/contact/create', { schema: createContactSchema }, postCreateContact);
  server.get('/contact/:userAddress', { schema: readContactsSchema }, getReadContacts);
  server.get('/contact', getReadAllUsers);
};

const postCreateContact = route<Contact>((req: FastifyRequest) => {
  return createNewContact(req.body as Contact);
});

const postCreateTransaction = route<Transaction>((req: FastifyRequest) => {
  return createNewTransaction(req.body as CreateTransactionRequest);
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

const createTransactionSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['hash', 'reciever', 'amount', 'note'],
    properties: {
      hash: { type: 'string', maxLength: 64, minLength: 64 },
      reciever: {
        type: 'object',
        required: ['address'],
        properties: {
          address: { type: 'string', maxLength: 64, minLength: 32 },
          name: { type: 'string', maxLength: 130 },
        },
      },
      amount: { type: 'number' },
    },
  },
};
