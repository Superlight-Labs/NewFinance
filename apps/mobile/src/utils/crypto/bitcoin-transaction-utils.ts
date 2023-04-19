import { BitcoinTransaction, Network } from '@superlight-labs/blockchain-api-client';
import { Psbt, SignerAsync } from 'der-bitcoinjs-lib';
import { getBitcoinJsNetwork } from './bitcoin-network';

export const isIncommingTransaction = (
  transaction: BitcoinTransaction,
  allTransactions: BitcoinTransaction[]
): boolean => {
  return !allTransactions.some(t =>
    t.inputs.some(input => input.prevout.hash === transaction.hash)
  );
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
): number => {
  const ownInputs = transaction.inputs.filter(input => input.coin.address === address);

  const ownOutputs = transaction.outputs.filter(output => output.address === address);

  const ownInputValue = ownInputs.reduce((prev, curr) => {
    return prev + curr.coin.value;
  }, 0);

  const ownOutputValue = ownOutputs.reduce((prev, curr) => {
    return prev + curr.value;
  }, 0);

  return ownOutputValue - ownInputValue;
};

/**
 * finds the index in outputs in utxo which can be spent again and is in our control (a address from account)
 * @param utxo
 * @param account
 * @returns
 */
export const getChangeIndexFromUTXO = (utxo: BitcoinTransaction, address: string): number => {
  return utxo.outputs.findIndex(output => output.address === address);
};

export const createTransaction = (
  network: Network,
  address: string,
  transactions: BitcoinTransaction[]
) => {
  const psbt = new Psbt({ network: getBitcoinJsNetwork(network) });
  const signers: SignerAsync[] = [];

  transactions.map(transaction => {
    if (isIncommingTransaction(transaction, transactions)) {
      psbt.addInput({
        hash: transaction.hash,
        index: getChangeIndexFromUTXO(transaction, address),
        nonWitnessUtxo: Buffer.from(transaction.hex, 'hex'),
      });

      signers.push();
    }
  });
};

// export const prepareSingleSigner = (user: User, address: Address): SignerAsync => {
//   const ec: SignerAsync = {
//     publicKey: Buffer.from(address.publicKey, "base64"),
//     sign: async (hash: Buffer) =>
//       Buffer.from([
//         ...Buffer.from(
//           await getDerSignature(
//             await signEcdsa(
//               user.devicePublicKey,
//               user.id,
//               address.keyShare.id,
//               address.keyShare.keyShare,
//               hash.toString("base64"),
//               "base64"
//             )
//           ),
//           "base64"
//         ),
//         0x01,
//       ]),
//   };
//   return ec;
// };
