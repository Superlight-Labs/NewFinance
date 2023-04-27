import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
  balance: number;
  navigate: () => void;
};

const WalletMenuItem = ({ name, balance, navigate }: Props) => {
  return (
    <Pressable className="w-[45rvw]" onPress={navigate}>
      <View className="flex h-[40vw] w-[40vw] items-center justify-center rounded-xl bg-blue-100">
        <View className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-400">
          <Text className="mt-2 font-manrope-bold text-4xl text-white">$</Text>
        </View>
      </View>
      <Text className="mt-3 font-inter-medium">{name}</Text>
      <Text className="font-inter text-slate-400">{balance} BTC</Text>
    </Pressable>
  );
};

export default WalletMenuItem;
