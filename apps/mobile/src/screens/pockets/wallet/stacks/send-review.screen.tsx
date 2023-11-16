import { StackScreenProps } from '@react-navigation/stack';
import {
  BroadCastTransactionBody,
  GetFeesRequest,
} from '@superlight-labs/api/src/routes/blockchain.routes';
import { CreateTransactionRequest } from '@superlight-labs/api/src/routes/transaction.routes';
import { BroadcastTransaction, Fees } from '@superlight-labs/blockchain-api-client';
import Big from 'big.js';
import ButtonComponent from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { useCreateBitcoinTransaction } from 'hooks/useCreateBitcoinTransaction';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useEffect, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { useSnackbarState } from 'state/snackbar.state';
import { getSizeFromLength, shortenAddress } from 'utils/string';
import { backend } from 'utils/superlight-api';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList, WalletTabList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList & WalletTabList, 'SendReview'>;

const SendReviewScreen = ({
  navigation,
  route: {
    params: { amount, rate, toAddress, sender, contact, note },
  },
}: Props) => {
  const { user } = useAuthState();
  const { network, addresses, getAccountBalance } = useBitcoinState();
  const [fee, setFee] = useState(0);
  const { createTransaction } = useCreateBitcoinTransaction(sender.account);
  const { perform } = useFailableAction();
  const { setMessage } = useSnackbarState();

  const numericAmount = parseFloat(amount);
  const balance = getAccountBalance(sender.account);
  const total = new Big(numericAmount).add(new Big(fee));

  useEffect(() => {
    if (balance < total.toNumber())
      setMessage({
        level: 'error',
        message: 'Insufficient funds',
        error: 'Insufficient funds',
      });
  }, [fee, numericAmount]);

  useEffect(() => {
    backend
      .post<Fees>('/blockchain/fees', {
        network,
        from: [...(addresses.get(sender.account) || [])].map(([_, a]) => a.address),
        to: [{ address: toAddress, value: parseFloat(amount) }],
      } as Partial<GetFeesRequest>)
      .then(fees => setFee(fees.data.medium));
  }, []);

  const createAndSendTransaction = useCallback(() => {
    setMessage({ level: 'progress', total: 1, step: 1, message: 'Processing Transaction' });
    perform(createTransaction(numericAmount, toAddress, fee)).onSuccess(trans => {
      backend.post('/transaction/create', {
        hash: trans.getId(),
        reciever: {
          address: toAddress,
          name: contact?.name,
        },
        sender: {
          address: sender.address,
          name: user?.username,
          userEmail: user?.email,
        },
        amount: numericAmount,
        note,
      } as CreateTransactionRequest);

      backend
        .post<BroadcastTransaction>('/blockchain/broadcast-transaction', {
          network,
          hash: trans.toHex(),
        } as Partial<BroadCastTransactionBody>)
        .then(_ => {
          setMessage({ level: 'success', message: 'Transaction sent successfully' });
          navigation.reset({ index: 1, routes: [{ name: 'Overview' }] });
        })
        .catch(error => {
          setMessage({ level: 'error', error, message: 'Failed to send Transaction' });
        });
    });
  }, [
    contact,
    setMessage,
    perform,
    network,
    navigation,
    createTransaction,
    numericAmount,
    toAddress,
    fee,
    note,
    sender,
    user,
  ]);

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <Text className="absolute right-6 top-6 font-manrope">Your Balance: {balance}</Text>
      <View className="flex flex-1 flex-col items-center justify-center p-4 pt-12">
        <Text className=" font-manrope-bold">Send</Text>
        <Title style={`p-2 font-bold ${getSizeFromLength(amount.length + 4)}`}>{amount} BTC</Title>
        <Text className="font-manrope-bold text-slate-400">
          ~ {(numericAmount * rate).toFixed(2)} €
        </Text>
        {!!fee && (
          <>
            <Text className="mt-12 font-manrope-bold text-slate-900">With Transaction Fees of</Text>
            <Text className="font-manrope-bold text-slate-400">
              ~ {fee} BTC / {(fee * rate).toFixed(2)} €
            </Text>
          </>
        )}

        <Text className="mt-12 font-manrope-bold">To</Text>
        <Title style="text-4xl mt-2 font-bold">{contact?.name || shortenAddress(toAddress)}</Title>
        {contact?.name && (
          <Text className="font-manrope-bold text-slate-400">{shortenAddress(toAddress)}</Text>
        )}

        <ButtonComponent
          disabled={balance < total.toNumber()}
          onPress={createAndSendTransaction}
          shadow
          style="px-12 w-full py-3 mt-auto">
          Send Amount now!
        </ButtonComponent>
      </View>
    </WalletLayout>
  );
};

export default SendReviewScreen;
