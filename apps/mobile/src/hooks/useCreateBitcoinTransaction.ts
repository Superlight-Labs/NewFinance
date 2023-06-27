import { API_URL } from '@env';
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
  getOutputIndexFromUtxo,
  getUnusedTransactionsNeededToReachValue,
  getValueOfTransactions,
  isSTXO,
  signAndFinalize,
} from 'utils/crypto/bitcoin-transaction-utils';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { useFailableAction } from './useFailable';

export const useCreateBitcoinTransaction = (account: string) => {
  const { network, getAccountTransactions, getAccountAddresses } = useBitcoinState();
  const { createSigner } = useBitcoinSigner();

  const {
    change: { address: changeAddress },
    external: { address: senderAddress },
  } = getAccountAddresses(account);

  const transactions = getAccountTransactions(account);

  return {
    createTransaction: (
      value: number,
      recieverAddress: string,
      fee: number
    ): ResultAsync<Transaction, AppError> => {
      const psbt = new Psbt({ network: getBitcoinJsNetwork(network) });
      const signers: SignerAsync[] = [];
      const totalValue = toSatoshi(value) + toSatoshi(fee);

      const allUnspent = transactions.filter(t => t.incomming && !isSTXO(t, transactions));

      const unspentT = getUnusedTransactionsNeededToReachValue(
        allUnspent,
        totalValue,
        senderAddress,
        changeAddress
      );

      if (unspentT.isErr()) {
        return errAsync(unspentT.error);
      }

      const changeValue =
        getValueOfTransactions(unspentT.value, senderAddress, changeAddress) - totalValue;

      if (changeValue < 0) {
        return errAsync(appError(undefined, 'Not enough funds'));
      }

      unspentT.value.map(transaction => {
        // Adding ingoing transaction
        psbt.addInput({
          hash: transaction.hash,
          index: getOutputIndexFromUtxo(transaction, senderAddress, changeAddress),
          nonWitnessUtxo: Buffer.from(transaction.hex, 'hex'),
        });

        signers.push(createSigner(transaction.address.publicKey, transaction.address.share));
      });

      try {
        psbt.addOutputs([
          {
            value: toSatoshi(value),
            address: recieverAddress,
          },
          {
            address: changeAddress,
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
    baseUrl: API_URL,
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
