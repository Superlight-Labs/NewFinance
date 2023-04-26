import { route } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { CreateTransactionRequest, Transaction } from 'src/repository/transaction';
import { createNewTransaction, getTransactions } from 'src/service/data/transactions.service';

export const registerTransactionRoutes = (server: FastifyInstance) => {
  server.post('/transaction/create', { schema: createTransactionSchema }, postCreateTransaction);
  server.get('/transaction/:userAddress', { schema: readTransactionsSchema }, getReadTransactions);
};

const postCreateTransaction = route<Transaction>((req: FastifyRequest) => {
  return createNewTransaction(req.body as CreateTransactionRequest);
});

const getReadTransactions = route<Transaction[]>((req: FastifyRequest) => {
  const params = req.params as any;

  return getTransactions(params.userAddress);
});

const readTransactionsSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['userAddress'],
    properties: {
      userAddress: { type: 'string', maxLength: 64, minLength: 32 },
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
