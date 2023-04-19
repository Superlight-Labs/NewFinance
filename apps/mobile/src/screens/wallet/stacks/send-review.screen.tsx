import Title from 'components/shared/title/title.component';
import { useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { View } from 'utils/wrappers/styled-react-native';

const SendAmountScreen = () => {
  const [amount, _] = useState(0);

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <View className="flex flex-1 flex-col items-center justify-center">
        <Title style="p-2 text-5xl font-extrabold">{amount} BTC</Title>
      </View>

      <ButtonComponent
        shadow
        disabled={amount <= 0}
        style=" mt-auto mb-12 rounded-lg"
        onPress={() => navigation.navigate('SendReview')}>
        Continue
      </ButtonComponent>
    </WalletLayout>
  );
};

export default SendAmountScreen;
