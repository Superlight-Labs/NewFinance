import { BitcoinBalance, BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import Big from 'big.js';

const conversion = 100000000;

export const toBitcoin = (satoshi: number) => {
  if (!Number.isInteger(satoshi)) {
    throw new TypeError('toBitcoin must be called on a whole number or string format whole number');
  }

  const bigSatoshi = new Big(satoshi);
  return Number(bigSatoshi.div(conversion));
};

/**
 * Convert Bitcoin to Satoshi
 * @param {number|string} bitcoin Amount of Bitcoin to convert
 * @throws {TypeError} Thrown if input is not a number or string
 * @returns {number}
 */
export const toSatoshi = (bitcoin: number) => {
  const bigBitcoin = new Big(bitcoin);
  return Math.floor(Number(bigBitcoin.times(conversion)));
};

export const safeBalance = (balance: BitcoinBalance | undefined) => {
  if (!balance) {
    return '0';
  }

  const bigIn = new Big(balance.incoming);
  const bigOut = new Big(balance.outgoing);

  return bigIn.sub(bigOut).toFixed();
};

/**
 * Calculates net value of a transaction
 * @param transaction
 * @param account
 * @returns
 */
export const getNetValueFromTransaction = (
  transaction: BitcoinTransaction,
  address: string,
  changeAddress: string
): number => {
  const ownInputs = transaction.inputs.filter(
    input => input.coin.address === address || input.coin.address === changeAddress
  );

  const ownOutputs = transaction.outputs.filter(
    output => output.address === address || output.address === changeAddress
  );

  const ownInputValue = ownInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const ownOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  return ownOutputValue - ownInputValue;
};

export const getTxFee = (transaction: BitcoinTransaction): number => {
  const inputTotal = transaction.inputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const outputTotal = transaction.outputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  return inputTotal - outputTotal;
};
