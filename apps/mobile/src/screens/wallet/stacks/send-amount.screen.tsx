import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineTextComponent from 'components/shared/input/multiline-text/multiline-text.component';
import Numpad from 'components/shared/numpad/numpad.component';
import { useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendAmount'>;

const SendAmountScreen = ({ navigation }: Props) => {
  const [amount, setAmount] = useState('0');

  const numericAmount = parseFloat(amount);

  return (
    <WalletLayout style="p-4" leftHeader="back" rightHeader="none">
      <View className="flex flex-1 flex-col">
        <View className="flex w-full flex-1 flex-row flex-wrap items-center justify-center p-2">
          <MultilineTextComponent
            style="border-0 m-w-[60%] flex m-h-48 text-6xl font-extrabold shadow-none bg-white"
            value={amount}
            keyboardType="numeric"
            setValue={setAmount}
          />
          <Text className="p-1 text-6xl font-extrabold">BTC</Text>
        </View>
      </View>
      <Numpad value={amount} setValue={setAmount} />
      <ButtonComponent
        shadow
        disabled={Number.isNaN(numericAmount) || numericAmount <= 0}
        style=" mt-auto mb-8 rounded-lg"
        onPress={() => navigation.navigate('SendReview')}>
        Continue
      </ButtonComponent>
    </WalletLayout>
  );
};

export default SendAmountScreen;
