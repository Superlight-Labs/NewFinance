import { Pressable, Text, View } from 'custom/styled-react-native';

type Props = {
  address?: string;
  name?: string;
  balance?: string;
  navigate: () => void;
};

const WalletMenuItem = ({
  address = '0xBabasdf34',
  name = 'Hauptkonto',
  balance = '1.234,45€',
  navigate,
}: Props) => {
  return (
    <Pressable className="w-[45rvw]" onPress={navigate}>
      <View className="h-[40vw] w-[40vw] rounded-lg bg-rose-500">
        <View className="mt-auto mb-4 ml-4 flex h-8 flex-row">
          <Text className="text-lg text-white">{truncate(address)}</Text>
        </View>
      </View>
      <Text>{name}</Text>
      <Text className="text-gray-500">{balance}</Text>
    </Pressable>
  );
};

const truncate = (text: string): string => {
  return text.substring(0, 5) + '...';
};

export default WalletMenuItem;
