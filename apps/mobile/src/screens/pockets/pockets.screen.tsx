import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect, useState } from 'react';
import { Performance, useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';

import { useQuery } from '@tanstack/react-query';
import LoadingWalletMainItem from 'components/wallets/wallet-item/loading-wallet-main-item.component';
import WalletMainItem from 'components/wallets/wallet-item/wallet-main-item.component';
import { RefreshControl } from 'react-native';
import { DataItem, TimeFrame } from 'src/types/chart';
import { backend, historyApi } from 'utils/superlight-api';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { PocketsStackParamList } from './pockets-navigation';

type Props = StackScreenProps<PocketsStackParamList, 'Pockets'>;

const emptyPerformance = {
  percentage: 0,
  absolute: 0,
  average: 0,
};

const Pockets = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet(() => navigation.navigate('SetupWallet'));
  const { secret, derivedUntilLevel } = useDeriveState();
  const {
    accounts,
    getAccountBalance,
    getTotalBalance,
    hasAddress,
    network,
    hasHydrated,
    getAccountPerformance,
  } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();
  const [accountPerformance, setAccountPerformance] = useState<Performance>(emptyPerformance);

  const loading = derivedUntilLevel < DerivedUntilLevel.COMPLETE;

  const { data: currentExchangeRate } = useQuery(
    ['exchangeRate'],
    () =>
      backend
        .post<any>('/blockchain/exchange-rate', {
          network,
        })
        .then(res => res.data),
    { retry: false, refetchInterval: 30000 }
  );

  const { data: historyDataTotal } = useQuery(
    ['historyData', 'total'],
    () => historyApi.get<DataItem[]>('/total').then(res => res.data),
    { retry: false }
  );

  useEffect(() => {
    if (historyDataTotal !== undefined && currentExchangeRate !== undefined)
      setAccountPerformance(
        getAccountPerformance('Main pocket', currentExchangeRate.value, historyDataTotal)
      );
  }, [historyDataTotal, currentExchangeRate]);

  useEffect(() => {
    if (hasHydrated && loading) {
      createBitcoinWallet(secret)(() => {
        updateAll();
      });
    }
  }, [hasHydrated, loading]);

  const updateAll = () => {
    for (const [key, _] of accounts) {
      update(key);
    }
  };

  const isUp = (value: number) => {
    return value > 0;
  };

  const [currentTimeFrame] = useState<TimeFrame>('total-graph');

  const prettifyDate = (date: string) => {
    if (date.includes('/')) {
      const dateParts = date.split('/');
      return `${dateParts[1]}.${dateParts[0]}.${dateParts[2].slice(2, 4)}`;
    }
    switch (currentTimeFrame) {
      case 'today': {
        return 'Today';
      }
      case 'weekly': {
        return 'Since 5 days';
      }
      case 'monthly': {
        return 'Since 1 month';
      }
      case 'year': {
        return 'Since 1 year';
      }
      case 'total-graph': {
        return 'Since start';
      }
    }
    return date;
  };

  return (
    <ScrollView
      className="h-full bg-white"
      refreshControl={
        !loading ? <RefreshControl refreshing={refreshing} onRefresh={updateAll} /> : undefined
      }
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      horizontal={false}>
      <View className="px-5">
        <PriceTextComponent
          style="font-[system] text-[32px] font-[700] leading-[32px] text-black"
          bitcoinAmount={getTotalBalance()}
        />

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
            {currentExchangeRate !== undefined &&
              (currentExchangeRate.value * getTotalBalance() - accountPerformance.absolute).toFixed(
                2
              )}
            € ({accountPerformance.percentage.toFixed(2)}
            %)
          </Text>
          <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
          <Text className="font-manrope text-sm font-bold text-grey">
            {prettifyDate('total-graph')}
          </Text>
        </View>
      </View>

      <View className="mt-8 px-4">
        {loading || !hasAddress() ? (
          <>
            <LoadingWalletMainItem />
          </>
        ) : (
          <WalletMainItem
            key={'Main pocket'}
            name={'Main pocket'}
            balance={getAccountBalance('Main pocket')}
            navigate={() => navigation.navigate('Wallet', { account: 'Main pocket' })}
          />
        )}
      </View>

      <View className="mx-5 mt-9 border-b-[1.5px] border-[#F6F7F8]" />

      {/* TODO - add this back in https://github.com/Superlight-Labs/NewFinance/issues/81 */}
      {/* {accounts.size > 1 ? (
        <View className="mb-8 mt-8 flex-row flex-wrap justify-between px-4">
          {[...accounts].slice(1).map(([key, _]) => (
            <WalletItem
              navigate={() => navigation.navigate('Wallet', { account: key })}
              name={key}
            />
          ))}

          <WalletMenuAdd navigate={showPocket} />
        </View>
      ) : (
        <View className="mt-32 items-center justify-center">
          <Text className="font-manrope-medium text-xs text-grey">Here are all you pockets.</Text>
          <Text className=" font-manrope-medium text-xs text-grey">
            Create as many pockets as you like.
          </Text>
          <Pressable className="mt-2 active:opacity-70" onPress={showPocket}>
            <Text className="text-center font-manrope text-sm font-bold text-[#0AAFFF]">
              Create pocket
            </Text>
          </Pressable>
        </View>
      )} */}
    </ScrollView>
  );
};

export default Pockets;
