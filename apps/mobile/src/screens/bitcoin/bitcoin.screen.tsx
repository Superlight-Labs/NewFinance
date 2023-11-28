import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { useState } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';
import { BitcoinStackParamList } from './bitcoin-navigation';

type Props = StackScreenProps<BitcoinStackParamList, 'Bitcoin'>;

const Bitcoin = ({ navigation }: Props) => {
  const { getTotalBalance } = useBitcoinState();

  const [scrollViewEnabled, setScrollViewEnabled] = useState<boolean>(true);

  const isUp = (value: number) => {
    return value > 0;
  };

  const calcPercentageChange = (start: number, value: number) => {
    return ((value / start) * 100 - 100).toFixed(2);
  };

  const calcAbsoluteChange = (start: number, value: number) => {
    return Math.abs(value - start).toFixed(2);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white"
      horizontal={false}
      scrollEnabled={scrollViewEnabled}>
      <BitcoinPreview
        onChartStart={() => setScrollViewEnabled(false)}
        onChartRelease={() => setScrollViewEnabled(true)}
      />
      <View className="mt-12 flex w-full flex-row justify-between px-5">
        <ButtonComponent
          onPress={() => navigation.navigate('SellBitcoin')}
          style="bg-[#F0F6F2] flex-1 mr-1"
          textStyle="text-black">
          Sell
        </ButtonComponent>

        <ButtonComponent
          onPress={() => navigation.navigate('BuyBitcoinStack')}
          style="flex-1 bg-[#51DC78] ml-1">
          Buy
        </ButtonComponent>
      </View>

      <Text className="mx-5 mt-12 font-manrope text-lg font-bold">You own</Text>

      <View className="mt-6 flex-row items-center justify-between px-5">
        <View className="">
          <Text className="font-manrope font-bold ">1 pocket</Text>
        </View>
        <View className="flex-col items-end">
          <PriceTextComponent
            bitcoinAmount={getTotalBalance()}
            style="font-manrope font-bold text-lg"
          />
          <Text className="font-manrope text-sm font-bold text-grey">{getTotalBalance()} BTC</Text>
        </View>
      </View>

      <View className="mt-10 flex-row items-center justify-between px-5">
        <View className="flex-col">
          <Text className="mb-1 font-manrope text-xs font-bold text-grey">BUY IN</Text>
          <Text className="font-manrope text-sm font-bold">25.670,31€</Text>
        </View>
        <View className="flex-col">
          <Text className="mb-1 font-manrope text-xs font-bold text-grey">PERFORMANCE</Text>
          <View className="flex-row items-center">
            {isUp(10) ? (
              <MonoIcon
                iconName="ChevronsUp"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#01DC0A'}
              />
            ) : (
              <MonoIcon
                iconName="ChevronsDown"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#FF3F32'}
              />
            )}

            <Text
              className="font-manrope text-sm font-bold text-[#01DC0A]"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ color: isUp(10) ? '#01DC0A' : '#FF3F32' }}>
              {calcAbsoluteChange(2, 10)}€ ({calcPercentageChange(3, 13)}%)
            </Text>
          </View>
        </View>
        <View className="flex-col">
          <Text className="mb-1 font-manrope text-xs font-bold text-grey">24H</Text>
          <View className="flex-row items-center">
            {isUp(10) ? (
              <MonoIcon
                iconName="ChevronsUp"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#01DC0A'}
              />
            ) : (
              <MonoIcon
                iconName="ChevronsDown"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#FF3F32'}
              />
            )}

            <Text
              className="font-manrope text-sm font-bold text-[#01DC0A]"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ color: isUp(10) ? '#01DC0A' : '#FF3F32' }}>
              {calcAbsoluteChange(2, 10)}€ ({calcPercentageChange(3, 13)}%)
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-5 mt-6 border-b-[1.5px] border-[#F6F7F8]" />

      <View className="px-5">
        <Text className="mt-12 font-manrope text-lg font-bold">About Bitcoin</Text>
        <Text className="mt-6 font-manrope text-sm font-semibold">
          Bitcoin is an innovative payment network and a new kind of money. Bitcoin uses
          peer-to-peer technology to work without central institutions or banks. It cannot be
          controlled by states or individuals.
        </Text>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-manrope text-xs font-bold text-grey">OFFER IN CIRCULATION</Text>
          <Text className="font-manrope text-sm font-bold">19,5 Mio</Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-manrope text-xs font-bold text-grey">OFFER IN TOTAL</Text>
          <Text className="font-manrope text-sm font-bold">21 Mio</Text>
        </View>
      </View>

      <View className="mx-5 mb-10 mt-6 border-b-[1.5px] border-[#F6F7F8]" />
    </ScrollView>
  );
};

export default Bitcoin;
