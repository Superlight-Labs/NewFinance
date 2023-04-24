import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
  balance: number;
  navigate: () => void;
};

const WalletMenuItem = ({ name, balance, navigate }: Props) => {
  return (
    <Pressable className="w-[45rvw]" onPress={navigate}>
      <View className="flex h-[40vw] w-[40vw] items-center justify-center rounded-xl bg-superblue-100">
        <View className="flex h-16 w-16 items-center justify-center rounded-md bg-superblue-400">
          <Text className="mt-1 text-4xl font-medium text-white">$</Text>
        </View>
      </View>
      <Text className="mt-3">{name}</Text>
      <Text className="text-gray-500">{balance} BTC</Text>
    </Pressable>
  );
};

export default WalletMenuItem;
