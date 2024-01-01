import { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { useEffect, useState } from 'react';
import { DataItem } from 'src/types/chart';
import { useBitcoinState } from 'state/bitcoin.state';
import { backend, historyApi } from 'utils/superlight-api';
import { openWebsite } from 'utils/web-opener';
import { Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';
import { BitcoinStackParamList } from './bitcoin-navigation';

type Props = StackScreenProps<BitcoinStackParamList, 'Bitcoin'>;

const Bitcoin = ({ navigation }: Props) => {
  const { getTotalBalance, network, accounts, getAccountPerformance } = useBitcoinState();
  const [accountPerformance, setAccountPerformance] = useState<any>({
    percentage: 0,
    absolute: 0,
    average: 0,
  });

  const { data: historyData } = useQuery(
    ['historyData', 'today'],
    () => historyApi.get<DataItem[]>('/today').then(res => res.data),
    { retry: false }
  );

  const { data: historyData24H } = useQuery(
    ['historyData', 'today'],
    () => historyApi.get<DataItem[]>('/today').then(res => res.data),
    { retry: false }
  );

  const { data: historyDataTotal } = useQuery(
    ['historyData', 'total'],
    () => historyApi.get<DataItem[]>('/total').then(res => res.data),
    { retry: false }
  );

  const { data: currentExchangeRate } = useQuery(
    ['exchangeRate'],
    () =>
      backend
        .post<any>('/blockchain/exchange-rate', {
          network,
        })
        .then(res => res.data),
    { retry: false }
  );

  useEffect(() => {
    console.log('historyData 24H: ', historyData24H);
  }, [historyData24H]);

  useEffect(() => {
    if (historyDataTotal !== undefined && currentExchangeRate !== undefined)
      setAccountPerformance(
        getAccountPerformance('Main pocket', currentExchangeRate.value, historyDataTotal)
      );
  }, [historyDataTotal, currentExchangeRate]);

  const [scrollViewEnabled, setScrollViewEnabled] = useState<boolean>(true);

  const isUp = (value: number) => {
    return value > 0;
  };

  const calcAbsoluteChange24H = () => {
    const totalBalance = getTotalBalance();
    const percentage =
      ((totalBalance * currentExchangeRate.value) / (totalBalance * historyData24H![0].value)) *
        100 -
      100;
    return (percentage * totalBalance * currentExchangeRate.value) / 100;
  };

  const calcRelativeChange24H = (): number => {
    if (currentExchangeRate === undefined || historyData24H === undefined) return 0;
    const totalBalance = getTotalBalance();
    return (
      ((totalBalance * currentExchangeRate.value) / (totalBalance * historyData24H![0].value)) *
        100 -
      100
    );
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
          onPress={() => navigation.navigate('ComingSoon', { text: 'Sell Bitcoin' })}
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
          {accounts.size === 1 && <Text className="font-manrope font-bold ">1 pocket</Text>}
          {accounts.size > 1 && (
            <Text className="font-manrope font-bold ">{accounts.size} pockets</Text>
          )}
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
          <Text className="font-manrope text-sm font-bold">
            {accountPerformance.average.toFixed(2)}€
          </Text>
        </View>
        <View className="flex-col">
          <Text className="mb-1 font-manrope text-xs font-bold text-grey">PERFORMANCE</Text>
          <View className="flex-row items-center">
            {isUp(accountPerformance.absolute) ? (
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
              style={{ color: isUp(accountPerformance.absolute) ? '#01DC0A' : '#FF3F32' }}>
              {accountPerformance.absolute.toFixed(2)}€ ({accountPerformance.percentage.toFixed(2)}
              %)
            </Text>
          </View>
        </View>
        <View className="flex-col">
          <Text className="mb-1 font-manrope text-xs font-bold text-grey">24H</Text>
          <View className="flex-row items-center">
            {isUp(calcRelativeChange24H()) ? (
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
              style={{ color: isUp(calcRelativeChange24H()) ? '#01DC0A' : '#FF3F32' }}>
              {historyData !== undefined &&
                currentExchangeRate !== undefined &&
                calcAbsoluteChange24H().toFixed(2)}
              € (
              {historyData !== undefined &&
                currentExchangeRate !== undefined &&
                calcRelativeChange24H().toFixed(2)}
              %)
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

      <View className="mx-5 mb-6 mt-6 border-b-[1.5px] border-[#F6F7F8]" />

      <Pressable
        className="mb-6 flex-row items-center justify-end px-5 active:opacity-80"
        onPress={() => openWebsite('https://www.coingecko.com')}>
        <Text className="mr-1 font-manrope text-xs font-bold text-grey">
          Data provided by CoinGecko
        </Text>
        <MonoIcon iconName="ExternalLink" width={14} height={14} />
      </Pressable>
    </ScrollView>
  );
};

export default Bitcoin;
