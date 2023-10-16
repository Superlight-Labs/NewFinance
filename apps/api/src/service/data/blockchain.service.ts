import { RouteError, thirdPartyError } from '@lib/routes/rest/rest-error';
import {
  BitcoinBalance,
  BitcoinService,
  BitcoinTransaction,
  BroadcastTransaction,
  ExchangeRate,
  Fees,
} from '@superlight-labs/blockchain-api-client';
import { ResultAsync } from 'neverthrow';
import {
  AddressInfoRequest,
  BaseBlockchainRequest,
  BroadCastTransactionBody,
  GetFeesRequest,
  GetTransactionsQuery,
} from 'src/routes/blockchain.routes';

export type BlockchainResult<T> = {
  [key: string]: T;
};

export const getBalance = ({
  addresses,
  network,
  provider,
}: AddressInfoRequest): ResultAsync<BlockchainResult<BitcoinBalance>, RouteError> => {
  const service = new BitcoinService(network);

  const balances = ResultAsync.combine(
    addresses.map(addr =>
      ResultAsync.fromPromise(
        service.getBalance(addr, provider).then(bal => ({ [addr]: bal })),
        e => thirdPartyError('Err while fetching balances', e)
      )
    )
  );

  return balances.map(balances => balances.reduce((acc, cur) => ({ ...acc, ...cur }), {}));
};

export const getTransactions = (
  { addresses, network, provider }: AddressInfoRequest,
  query: GetTransactionsQuery
): ResultAsync<BlockchainResult<BitcoinTransaction[]>, RouteError> => {
  const service = new BitcoinService(network);

  const transactions = ResultAsync.combine(
    addresses.map(addr =>
      ResultAsync.fromPromise(
        service
          .getTransactions(addr, new URLSearchParams(query), provider)
          .then(bal => ({ [addr]: bal })),
        e => thirdPartyError('Err while fetching transactions', e)
      )
    )
  );

  return transactions.map(ts => ts.reduce((acc, cur) => ({ ...acc, ...cur }), {}));
};

// TODO: change this back to fromUTXO since its not advised by tatum to use more than 1 tx per address in this way
export const getFees = ({
  from,
  to,
  network,
  provider,
}: GetFeesRequest): ResultAsync<Fees, RouteError> => {
  const service = new BitcoinService(network);

  return ResultAsync.fromPromise(service.getFees(from, to, provider), err =>
    thirdPartyError("Couldn't get fees from Provider", err)
  );
};

export const getExchangeRate = ({
  network,
  provider,
}: BaseBlockchainRequest): ResultAsync<ExchangeRate, RouteError> => {
  const service = new BitcoinService(network);

  return ResultAsync.fromPromise(service.getExchangeRate(provider), err =>
    thirdPartyError("Couldn't get exchange rate from Provider", err)
  );
};

export const broadcastTransaction = ({
  network,
  provider,
  hash,
}: BroadCastTransactionBody): ResultAsync<BroadcastTransaction, RouteError> => {
  const service = new BitcoinService(network);

  return ResultAsync.fromPromise(service.sendBroadcastTransaction(hash, provider), err =>
    thirdPartyError('Err while broadcasting transaction', err)
  );
};
