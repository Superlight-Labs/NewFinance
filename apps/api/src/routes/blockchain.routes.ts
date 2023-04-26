import { Static, Type } from '@fastify/type-provider-typebox';
import { route } from '@lib/routes/rest/rest-handlers';
import {
  BitcoinBalance,
  BitcoinProviderEnum,
  BitcoinTransaction,
  BroadcastTransaction,
  ExchangeRate,
  Fees,
  Network,
} from '@superlight-labs/blockchain-api-client';
import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  BlockchainResult,
  broadcastTransaction,
  getBalance,
  getExchangeRate,
  getFees,
  getTransactions,
} from 'src/service/data/blockchain.service';

const baseRequestBody = Type.Object({
  provider: Type.Enum(BitcoinProviderEnum, { default: BitcoinProviderEnum.TATUM }),
  network: Type.Union([Type.Literal<Network>('main'), Type.Literal<Network>('test')], {
    default: 'main',
  }),
});

const broadCastTransactionBody = Type.Object({
  hash: Type.String({ maxLength: 512, minLength: 12 }),
  ...baseRequestBody.properties,
});

const getAddrInfoBody = Type.Object({
  addresses: Type.Array(Type.String({ minLength: 32, maxLength: 64 })),
  ...baseRequestBody.properties,
});

const getFeesBody = Type.Object({
  from: Type.Array(Type.String({ minLength: 32, maxLength: 64 })),
  to: Type.Array(
    Type.Object({
      address: Type.String({ minLength: 32, maxLength: 64 }),
      value: Type.Number({ minimum: 0 }),
    })
  ),
  ...baseRequestBody.properties,
});

const getTransactionsQuery = Type.Object({
  pageSize: Type.String({ maxLength: 3, minLength: 1, default: '10' }),
  offset: Type.String({ maxLength: 3, minLength: 1, default: '0' }),
});

export type BroadCastTransactionBody = Static<typeof broadCastTransactionBody>;
export type BaseBlockchainRequest = Static<typeof baseRequestBody>;
export type GetFeesRequest = Static<typeof getFeesBody>;
export type AddressInfoRequest = Static<typeof getAddrInfoBody>;
export type GetTransactionsQuery = Static<typeof getTransactionsQuery>;

export const registerBlockchainRoutes = (server: FastifyInstance) => {
  server.post(
    '/blockchain/balance',
    { schema: { body: getAddrInfoBody } },
    route<BlockchainResult<BitcoinBalance>>((req: FastifyRequest) =>
      getBalance(req.body as AddressInfoRequest)
    )
  );

  server.post(
    '/blockchain/transactions',
    { schema: { body: getAddrInfoBody, querystring: getTransactionsQuery } },
    route<BlockchainResult<BitcoinTransaction[]>>((req: FastifyRequest) =>
      getTransactions(req.body as AddressInfoRequest, req.query as GetTransactionsQuery)
    )
  );

  server.post(
    '/blockchain/fees',
    { schema: { body: getFeesBody } },
    route<Fees>((req: FastifyRequest) => {
      return getFees(req.body as GetFeesRequest);
    })
  );

  server.post(
    '/blockchain/exchange-rate',
    { schema: { body: baseRequestBody } },
    route<ExchangeRate>((req: FastifyRequest) => getExchangeRate(req.body as BaseBlockchainRequest))
  );

  server.post(
    '/blockchain/broadcast-transaction',
    { schema: { body: broadCastTransactionBody } },
    route<BroadcastTransaction>((req: FastifyRequest) =>
      broadcastTransaction(req.body as BroadCastTransactionBody)
    )
  );
};
