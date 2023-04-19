import Title from 'components/shared/title/title.component';
import { useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { View } from 'utils/wrappers/styled-react-native';

const SendReviewScreen = () => {
  const [amount, _] = useState(0);

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <View className="flex flex-1 flex-col items-center justify-center">
        <Title style="p-2 text-5xl font-extrabold">{amount} BTC</Title>
      </View>
    </WalletLayout>
  );
};

export default SendReviewScreen;
