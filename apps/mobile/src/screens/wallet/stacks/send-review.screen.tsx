import { StackScreenProps } from '@react-navigation/stack';
import {
  BroadCastTransactionBody,
  GetFeesRequest,
} from '@superlight-labs/api/src/routes/blockchain.routes';
import { BroadcastTransaction } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { useCreateBitcoinTransaction } from 'hooks/useCreateBitcoinTransaction';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useEffect, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
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
  const { network, addresses, getAccountBalance } = useBitcoinState();
  const [fee, setFee] = useState(0);
  const { createTransaction } = useCreateBitcoinTransaction(sender.account);
  const { perform } = useFailableAction();
  const { setMessage } = useSnackbarState();

  useEffect(() => {
    backend
      .post('/blockchain/fees', {
        network,
        from: [...(addresses.get(sender.account) || [])].map(([_, a]) => a.address),
        to: [{ address: toAddress, value: parseFloat(amount) }],
      } as Partial<GetFeesRequest>)
      .then(fees => setFee(fees.data.medium));
  }, []);

  const numericAmount = parseFloat(amount);

  const createAndSendTransaction = useCallback(() => {
    setMessage({ level: 'progress', total: 1, step: 1, message: 'Processing Transaction' });
    perform(createTransaction(numericAmount, toAddress, fee)).onSuccess(trans => {
      backend.post('/transaction/create', {
        hash: trans.getId(),
        reciever: {
          address: toAddress,
          name: contact?.name,
        },
        amount: numericAmount,
        note,
      });

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
  ]);

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <Text className="absolute right-6 top-6">
        Your Balance: {getAccountBalance(sender.account)}
      </Text>
      <View className="flex flex-1 flex-col items-center justify-center p-4 pt-24">
        <Text className=" font-bold">Send</Text>
        <Title style={`p-2 font-extrabold ${getSizeFromLength(amount.length + 4)}`}>
          {amount} BTC
        </Title>
        <Text className="font-bold text-slate-400">~ {(numericAmount * rate).toFixed(2)} €</Text>
        {!!fee && (
          <>
            <Text className="mt-12 font-bold text-slate-900">With Transaction Fees of</Text>
            <Text className="font-bold text-slate-400">
              ~ {fee} BTC / {(fee * rate).toFixed(2)} €
            </Text>
          </>
        )}

        <Text className="mt-12 font-bold">To</Text>
        <Title style="text-4xl mt-2 font-extrabold">
          {contact?.name || shortenAddress(toAddress)}
        </Title>
        {contact?.name && (
          <Text className="font-bold text-slate-400">{shortenAddress(toAddress)}</Text>
        )}

        <ButtonComponent
          onPress={createAndSendTransaction}
          shadow
          style="px-12 mb-8 rounded-lg mt-auto">
          Send Amount now!
        </ButtonComponent>
      </View>
    </WalletLayout>
  );
};

export default SendReviewScreen;
