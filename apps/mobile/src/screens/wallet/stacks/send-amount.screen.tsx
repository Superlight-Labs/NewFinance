import { StackScreenProps } from '@react-navigation/stack';
import { ExchangeRate } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineTextComponent from 'components/shared/input/multiline-text/multiline-text.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Numpad from 'components/shared/numpad/numpad.component';
import { useDebounce } from 'hooks/useDebounced';
import { useEffect, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state';
import { getSizeFromLength } from 'utils/string';
import { backend } from 'utils/superlight-api';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendAmount'>;

const SendAmountScreen = ({ navigation, route }: Props) => {
  const { sender } = route.params;
  const [amount, setAmount] = useState('0');
  const [rate, setRate] = useState(0);
  const [loadRate, setLoadRate] = useState(false);
  const { network, getAccountBalance } = useBitcoinState();
  const debouncedAmount = useDebounce(amount, 5000);

  useEffect(() => {
    setLoadRate(true);
    backend.post<ExchangeRate>('/blockchain/exchange-rate', { network }).then(res => {
      setLoadRate(false);
      setRate(parseFloat(res.data.value));
    });
  }, [debouncedAmount]);

  const numericAmount = parseFloat(amount);
  const textSize = getSizeFromLength(amount.length);

  const balance = getAccountBalance(sender.account);

  return (
    <WalletLayout style="p-4 flex-1" leftHeader="back" rightHeader="none">
      <View className="absolute top-10 flex flex-row items-center justify-center self-center">
        <Text>Available: {balance} BTC</Text>
      </View>
      <View className="flex flex-grow flex-col items-center">
        <View className="flex w-full flex-1 flex-row flex-wrap items-center justify-center">
          <MultilineTextComponent
            style={`border-0 m-w-[100%] flex m-h-48 font-bold shadow-none bg-white ${textSize}`}
            value={amount}
            keyboardType="numeric"
            maxLength={10}
            setValue={setAmount}
          />
          <Text className={`${textSize} p-1 font-bold`}>BTC</Text>
          {numericAmount > 0 && (
            <View className="flex w-[100%] flex-row items-center justify-center">
              <Text>~ ${(numericAmount * rate).toFixed(2)} €</Text>
              {loadRate && <MonoIcon width={12} height={12} iconName="Loading" />}
            </View>
          )}
        </View>
      </View>
      <Numpad style="mb-20" maxLength={10} value={amount} setValue={setAmount} />
      <ButtonComponent
        disabled={
          Number.isNaN(numericAmount) || numericAmount <= 0 || !balance || numericAmount > balance
        }
        style=" mt-auto py-3"
        onPress={() => navigation.navigate('SendReview', { amount, rate, ...route.params })}>
        Continue
      </ButtonComponent>
    </WalletLayout>
  );
};

export default SendAmountScreen;
