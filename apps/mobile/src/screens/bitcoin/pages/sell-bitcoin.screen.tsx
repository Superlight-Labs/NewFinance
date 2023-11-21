import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { BitcoinStackParamList } from '../bitcoin-navigation';

type Props = StackScreenProps<BitcoinStackParamList, 'SellBitcoin'>;

const SellBitcoinScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Sell Bitcoin
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          Choose amount to sell.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SellBitcoinScreen;
