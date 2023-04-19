import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';

export const isIncommingTransaction = (transaction: BitcoinTransaction, address: string) => {
  return transaction.outputs[0].address === address;
};

/**
 * Calculates net value of a transaction
 * @param transaction
 * @param account
 * @returns
 */
export const getNetValueFromTransaction = (
  transaction: BitcoinTransaction,
  address: string
): string => {
  const ownInputs = transaction.inputs.filter(input => input.coin.address === address);

  const ownOutputs = transaction.outputs.filter(output => output.address === address);

  const ownInputValue = ownInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const ownOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  const value = ownOutputValue - ownInputValue;

  return `${value > 0 ? '+' : ''}${value}`;
};
