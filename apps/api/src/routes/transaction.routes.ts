import { Static, Type } from '@fastify/type-provider-typebox';
import { route } from '@lib/routes/rest/rest-handlers';
import { FastifyInstance, FastifyRequest, FastifySchema } from 'fastify';
import { Transaction } from 'src/repository/transaction';
import { createNewTransaction, getTransactions } from 'src/service/data/transactions.service';

const readTransactionsSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['userAddress'],
    properties: {
      userAddress: { type: 'string', maxLength: 64, minLength: 32 },
    },
  },
};

const createTransactionSchema = Type.Object({
  hash: Type.String({ maxLength: 64, minLength: 64 }),
  reciever: Type.Object({
    address: Type.String({ maxLength: 64, minLength: 32 }),
    name: Type.String({ maxLength: 130 }),
  }),
  sender: Type.Object({
    address: Type.String({ maxLength: 64, minLength: 32 }),
    userEmail: Type.String({ maxLength: 130 }),
  }),
  amount: Type.Number(),
  note: Type.Optional(Type.String({ maxLength: 130 })),
});

export type CreateTransactionRequest = Static<typeof createTransactionSchema>;

export const registerTransactionRoutes = (server: FastifyInstance) => {
  server.post(
    '/transaction/create',
    { schema: { body: createTransactionSchema } },
    postCreateTransaction
  );
  server.get('/transaction/:userAddress', { schema: readTransactionsSchema }, getReadTransactions);
};

const postCreateTransaction = route<Transaction>((req: FastifyRequest) => {
  return createNewTransaction(req.body as CreateTransactionRequest);
});

const getReadTransactions = route<Transaction[]>((req: FastifyRequest) => {
  const params = req.params as any;

  return getTransactions(params.userAddress);
});
