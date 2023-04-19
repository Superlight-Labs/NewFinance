import { StackScreenProps } from '@react-navigation/stack';
import { User } from '@superlight-labs/api/src/repository/user';
import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { useEffect, useRef, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state.';
import { getSizeFromLength, shortenAddress } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendReview'>;

const SendReviewScreen = ({
  route: {
    params: { amount, rate, toAddress, note: _ },
  },
}: Props) => {
  const {
    network,
    indexAddress: { address },
  } = useBitcoinState();
  const service = useRef(new BitcoinService(network));
  const [fee, setFee] = useState(0);
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

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <View className="flex flex-1 flex-col items-center justify-center">
        <Text className=" font-bold">Send</Text>
        <Title style={`p-2 font-extrabold ${getSizeFromLength(amount.length + 4)}`}>
          {amount} BTC
        </Title>
        {!!fee && (
          <Text>
            Fee: ~ {fee} BTC / {(fee * rate).toFixed(2)} €
          </Text>
        )}

        <Text className="font-bold">To</Text>
        <Text className="text-3xl">{recipient.name || shortenAddress(toAddress)}</Text>

        <ButtonComponent onPress={() => undefined} style="px-12 mt-24">
          Send Amount now!
        </ButtonComponent>
      </View>
    </WalletLayout>
  );
};

export default SendReviewScreen;
