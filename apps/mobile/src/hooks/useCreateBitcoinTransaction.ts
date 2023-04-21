import { AppError, appError } from '@superlight-labs/mpc-common';
import { useSignEcdsa } from '@superlight-labs/rn-mpc-client';
import { Psbt, SignerAsync, Transaction } from 'der-bitcoinjs-lib';
import { Result, ResultAsync, errAsync } from 'neverthrow';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { SharePair } from 'state/derive.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { getBitcoinJsNetwork } from 'utils/crypto/bitcoin-network';
import {
  getChangeIndexFromUTXO,
  getUnusedTransactionsNeededToReachValue,
  getValueOfTransactions,
  isIncommingTransaction,
  isSTXO,
  signAndFinalize,
} from 'utils/crypto/bitcoin-transaction-utils';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { apiUrl } from 'utils/superlight-api';
import { useFailableAction } from './useFailable';

export const useCreateBitcoinTransaction = () => {
  const {
    network,
    indexAddress: { address: senderAddress, transactions, publicKey, share },
  } = useBitcoinState();
  const { createSigner } = useBitcoinSigner();

  return {
    createTransaction: (
      value: number,
      recieverAddress: string,
      fee: number
    ): ResultAsync<Transaction, AppError> => {
      const psbt = new Psbt({ network: getBitcoinJsNetwork(network) });
      const signers: SignerAsync[] = [];
      const totalValue = toSatoshi(value) + toSatoshi(fee);

      const allUnspent = transactions.filter(
        t => isIncommingTransaction(t, senderAddress) && !isSTXO(t, transactions)
      );

      const unspentT = getUnusedTransactionsNeededToReachValue(
        allUnspent,
        totalValue,
        senderAddress
      );

      if (unspentT.isErr()) {
        return errAsync(unspentT.error);
      }

      const changeValue = getValueOfTransactions(unspentT.value, senderAddress) - totalValue;

      if (changeValue < 0) {
        return errAsync(appError(undefined, 'Not enough funds'));
      }

      unspentT.value.map(transaction => {
        // Adding ingoing transaction
        psbt.addInput({
          hash: transaction.hash,
          index: getChangeIndexFromUTXO(transaction, senderAddress),
          nonWitnessUtxo: Buffer.from(transaction.hex, 'hex'),
        });

        signers.push(createSigner(publicKey, share));
      });

      try {
        psbt.addOutputs([
          {
            value: toSatoshi(value),
            address: recieverAddress,
          },
          {
            address: senderAddress,
            value: changeValue,
          },
        ]);
      } catch (error) {
        return errAsync(appError(error, 'Recipient is not valid'));
      }

      return signAndFinalize(psbt, signers).andThen(pbst =>
        Result.fromThrowable(
          () => pbst.extractTransaction(),
          err => appError(err, 'Transaction preperation failed')
        )()
      );
    },
  };
};

const useBitcoinSigner = () => {
  const { user } = useAuthState();
  const { perform } = useFailableAction();
  const { signEcdsa } = useSignEcdsa();

  if (!user) throw new Error('User is not authenticated!');

  const config = {
    baseUrl: apiUrl,
    sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
  };

  return {
    createSigner: (publicKey: string, share: SharePair): SignerAsync => ({
      publicKey: Buffer.from(publicKey, 'base64'),
      sign: async (hash: Buffer) =>
        new Promise(resolve => {
          perform(
            signEcdsa(config, {
              messageToSign: hash.toString('base64'),
              encoding: 'base64',
              share: share.share,
              peerShareId: share.peerShareId,
            })
          ).onSuccess(result => {
            resolve(Buffer.from([...Buffer.from(result, 'base64'), 0x01]));
          });
        }),
    }),
  };
};
