import { StackScreenProps } from '@react-navigation/stack';
import { User } from '@superlight-labs/api/src/repository/user';
import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { useCreateBitcoinTransaction } from 'hooks/useCreateBitcoinTransaction';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useEffect, useRef, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state.';
import { useSnackbarState } from 'state/snackbar.state';
import { safeBalance } from 'utils/crypto/bitcoin-value';
import { getSizeFromLength, shortenAddress } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList, WalletTabList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList & WalletTabList, 'SendReview'>;

const SendReviewScreen = ({
  navigation,
  route: {
    params: { amount, rate, toAddress, note: _ },
  },
}: Props) => {
  const {
    network,
    indexAddress: { address, balance },
  } = useBitcoinState();
  const service = useRef(new BitcoinService(network));
  const [fee, setFee] = useState(0);
  const { createTransaction } = useCreateBitcoinTransaction();
  const { perform } = useFailableAction();
  const { setMessage } = useSnackbarState();

  useEffect(() => {
    service.current
      .getFees(
        [address],
        [{ address: toAddress, value: parseFloat(amount) }],
        BitcoinProviderEnum.TATUM
      )
      .then(fees => setFee(fees.medium));
  }, []);

  const recipient: User | any = {}; // { name: 'Lance' };
  const numericAmount = parseFloat(amount);

  const createAndSendTransaction = useCallback(() => {
    setMessage({ level: 'progress', total: 1, step: 1, message: 'Processing Transaction' });
    perform(createTransaction(numericAmount, toAddress, fee)).onSuccess(trans => {
      service.current
        .sendBroadcastTransaction(trans.toHex(), BitcoinProviderEnum.TATUM)
        .then(_ => {
          setMessage({ level: 'success', message: 'Transaction sent successfully' });
          navigation.reset({ index: 1, routes: [{ name: 'Overview' }] });
        })
        .catch(error => {
          setMessage({ level: 'error', error, message: 'Failed to send Transaction' });
        });
    });
  }, [setMessage, perform, service, createTransaction, numericAmount, toAddress, fee]);

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <Text className="absolute right-6 top-6">Your Balance: {safeBalance(balance)}</Text>
      <View className="flex flex-1 flex-col items-center justify-center p-4 pt-24">
        <Text className=" font-bold">Send</Text>
        <Title style={`p-2 font-extrabold ${getSizeFromLength(amount.length + 4)}`}>
          {amount} BTC
        </Title>
        <Text>~ {(numericAmount * rate).toFixed(2)} €</Text>
        {!!fee && (
          <>
            <Text className="mt-12 font-bold">With Transaction Fees of</Text>
            <Text className="text-xl">
              ~ {fee} BTC / {(fee * rate).toFixed(2)} €
            </Text>
          </>
        )}

        <Text className="mt-12 font-bold">To</Text>
        <Title style="text-5xl font-extrabold">{recipient.name || shortenAddress(toAddress)}</Title>

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
