import WalletLayout from 'screens/wallet/wallet-layout.component';
import { Text, View } from 'utils/wrappers/styled-react-native';

const Receive = () => {
  return (
    <WalletLayout>
      <View className="flex w-full flex-col items-center justify-center pb-8">
        <Text>Hi this is a Wallet recieve Screen</Text>
      </View>
    </WalletLayout>
  );
};

export default Receive;
