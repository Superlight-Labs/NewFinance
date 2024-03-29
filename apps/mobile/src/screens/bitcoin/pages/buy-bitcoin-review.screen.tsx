import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { Switch } from 'react-native';
import { formatCurrency } from 'utils/format/format';
import { SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';
import { BuyBitcoinStackParamList } from './buy-bitcoin-navigation';

type Props = StackScreenProps<BuyBitcoinStackParamList, 'BuyBitcoinReview'>;

const BuyBitcoinReviewScreen = ({
  route: {
    params: { amount, currency },
  },
}: Props) => {
  const { getPrice } = useBitcoinPrice();

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="h-full justify-between px-5 pt-12">
        <View>
          <View className="flex-col">
            <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
              Get
            </Text>
            <Text className="mt-1 font-[system] text-[32px] font-[700] leading-[32px] text-black">
              {(amount / getPrice()).toFixed(8)} Bitcoin
            </Text>
          </View>

          <View className="border-1 mt-4 border-b border-[#F6F7F8] pb-4">
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">TO POCKET</Text>
              <Text className="font-manrope text-sm font-bold">Main pocket</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">ORDER</Text>
              <View className="items-end">
                <Text className="font-manrope text-sm font-bold">Mine</Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">PRICE PER BITCOIN</Text>
              <Text className="font-manrope text-sm font-bold">{formatCurrency(getPrice())}</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">AMOUNT</Text>
              <Text className="font-manrope text-sm font-bold">{amount + ' ' + currency}</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">AMOUNT IN BITCOIN</Text>
              <Text className="font-manrope text-sm font-bold">
                {(amount / getPrice()).toFixed(8)}
              </Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">RECURRING</Text>
              <Switch disabled={true} />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">FEES</Text>
              <Text className="font-manrope text-sm font-bold">0,00 €</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-black">TOTAL</Text>
              <Text className="font-manrope text-sm font-bold">0,00 €</Text>
            </View>
          </View>
          <View className="mt-6">
            <Text className="font-manrope text-xs font-medium text-grey">
              You are mining testnet Bitcoin - Note that these Bitcoin do not have real value and
              are just for testing purposes.
            </Text>
          </View>
        </View>
        <View>
          <ButtonComponent onPress={() => {}} style="">
            Get now
          </ButtonComponent>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BuyBitcoinReviewScreen;
