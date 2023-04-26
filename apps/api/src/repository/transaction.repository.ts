import { other } from '@lib/routes/rest/rest-error';
import { client } from '@superlight-labs/database';
import { CreateTransactionRequest, Transaction } from './transaction';

export const createTransaction = async (
  request: CreateTransactionRequest
): Promise<Transaction> => {
  const transaction = await client.transaction.create({
    data: {
      ...request,
      reciever: {
        connectOrCreate: {
          create: { ...request.reciever },
          where: {
            address: request.reciever.address,
          },
        },
      },
    },
    include: {
      reciever: true,
    },
  });

  if (!transaction) throw other('Error while creating transaction');

  return transaction;
};

export const readTransactions = async (userAddress: string) => {
  const contacts = await client.transaction.findMany({
    where: {
      OR: [
        {
          recieverAddress: userAddress,
        },
        {
          senderAddress: userAddress,
        },
      ],
    },
  });

  if (!contacts) throw other('Error while reading Contacts');

  return contacts;
};
