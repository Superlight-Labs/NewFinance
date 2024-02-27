import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Numpad from 'components/shared/numpad/numpad.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useState } from 'react';
import { useGeneralState } from 'state/general.state';
import { formatCurrency } from 'utils/format/format';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';
import { BuyBitcoinStackParamList } from './buy-bitcoin-navigation';

type Props = StackScreenProps<BuyBitcoinStackParamList, 'BuyBitcoin'>;

const BuyBitcoinScreen = ({ navigation }: Props) => {
  const [amount, setAmount] = useState('');

  const { getPrice } = useBitcoinPrice();
  const { currency } = useGeneralState();

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
    <SafeAreaView className="h-full bg-white">
      <View className="mx-5 h-full flex-col justify-between">
        <View className="mt-12 flex flex-grow flex-col ">
          <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
            Get Bitcoin
          </Text>
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
            <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
            <Text className="font-manrope text-sm font-bold text-grey">
              {formatCurrency(getPrice(), currency)}
            </Text>
          </View>
          <View className="relative mt-6 flex w-full flex-row flex-wrap items-center justify-center">
            <TextInputComponent
              style="text-xl py-3"
              placeHolder="0,00"
              value={amount}
              onChangeText={setAmount}
            />
            <View className="absolute right-0 flex-row items-center justify-center rounded bg-[#F5F5F5] px-1 py-1">
              <Pressable className="items-center rounded bg-white px-3 py-1">
                <Text className="font-manrope text-sm font-semibold text-[#008249]">
                  {currency}
                </Text>
              </Pressable>
            </View>
            {/*
            //For later release
            <View className="absolute right-0 w-24 flex-row items-center justify-center rounded bg-[#F5F5F5] px-1 py-1">
              <Pressable className="w-1/2 items-center rounded-sm px-1.5">
                <Text className="font-manrope text-sm font-semibold">BTC</Text>
              </Pressable>
              <Pressable className=" w-1/2 items-center rounded bg-white px-1.5 py-1">
                <Text className="font-manrope text-sm font-semibold text-[#008249]">
                  {currency}
                </Text>
              </Pressable>
            </View>*/}
          </View>
          <View className="mt-4 flex-row">
            <Pressable
              className="mr-2 rounded bg-[#F5F5F5] px-5 py-2"
              onPress={() => setAmount('2,00')}>
              <Text className="font-manrope text-sm font-semibold">2,00 €</Text>
            </Pressable>
            <Pressable
              className="mr-2 rounded bg-[#F5F5F5] px-5 py-2"
              onPress={() => setAmount('5,00')}>
              <Text className="font-manrope text-sm font-semibold">5,00 €</Text>
            </Pressable>
            <Pressable
              className="rounded bg-[#F5F5F5] px-5 py-2"
              onPress={() => setAmount('10,00')}>
              <Text className="font-manrope text-sm font-semibold">10,00 €</Text>
            </Pressable>
          </View>
        </View>
        <View className="mb-6 flex-col items-center space-y-3">
          <Text className="font-manrope text-xs font-semibold text-grey">
            You get Testnet Bitcoin for free
          </Text>
        </View>
        <Numpad style="mb-6" maxLength={10} value={amount} setValue={setAmount} />
        <ButtonComponent
          disabled={amount.length === 0}
          style=""
          onPress={() => {
            navigation.navigate('BuyBitcoinReview', { amount: parseFloat(amount), currency });
          }}>
          Next
        </ButtonComponent>
      </View>
    </SafeAreaView>
  );
};

export default BuyBitcoinScreen;
