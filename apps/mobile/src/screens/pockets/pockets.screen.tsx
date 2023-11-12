import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import LoadingWalletItem from 'components/wallets/wallet-item/loading-wallet-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';

import WalletMainItem from 'components/wallets/wallet-item/wallet-main-item.component';
import { TimeFrame } from 'src/types/chart';
import { Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { PocketsStackParamList } from './pockets-navigation';

type Props = StackScreenProps<PocketsStackParamList, 'Pockets'>;

const Pockets = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet(() => navigation.navigate('SetupWallet'));
  const { secret, derivedUntilLevel, name } = useDeriveState();
  const { accounts, getAccountBalance, getTotalBalance, hasAddress, hasHydrated } =
    useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const loading = derivedUntilLevel < DerivedUntilLevel.COMPLETE;

  useEffect(() => {
    if (hasHydrated && loading) {
      createBitcoinWallet(secret)(() => {
        updateAll();
      });
    }
  }, [hasHydrated]);

  const updateAll = () => {
    for (const [key, _] of accounts) {
      update(key);
    }
  };

  const refreshControl = loading ? undefined : (
    <RefreshControl refreshing={refreshing} onRefresh={updateAll} />
  );

  const isUp = (value: number) => {
    return value > 0;
  };

  const calcPercentageChange = (start: number, value: number) => {
    return ((value / start) * 100 - 100).toFixed(2);
  };

  const calcAbsoluteChange = (start: number, value: number) => {
    return Math.abs(value - start).toFixed(2);
  };

  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('Y');

  const prettifyDate = (date: string) => {
    if (date.includes('/')) {
      const dateParts = date.split('/');
      return `${dateParts[1]}.${dateParts[0]}.${dateParts[2].slice(2, 4)}`;
    }
    switch (currentTimeFrame) {
      case 'T': {
        return 'Today';
      }
      case 'W': {
        return 'Since 5 days';
      }
      case 'M': {
        return 'Since 1 month';
      }
      case 'Y': {
        return 'Since 1 year';
      }
      case 'MAX': {
        return 'Since start';
      }
    }
    return date;
  };

  return (
    <ScrollView
      className="h-full bg-white"
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      horizontal={false}>
      <View className="px-5">
        <PriceTextComponent
          style="font-[system] text-[32px] font-[700] leading-[32px] text-black"
          bitcoinAmount={getTotalBalance()}
        />

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
          <Text className="font-manrope text-sm font-bold text-grey">{prettifyDate('T')}</Text>
        </View>
      </View>

      <View className="mt-8 px-4">
        {loading || !hasAddress() ? (
          <>
            <LoadingWalletItem name={name} />
          </>
        ) : (
          [...accounts].map(([key, _]) => (
            <WalletMainItem
              key={key}
              name={key}
              balance={getAccountBalance(key)}
              navigate={() => navigation.navigate('WalletTab', { account: key })}
            />
          ))
        )}
      </View>

      <View className="mx-5 mt-9 border-b-[1.5px] border-[#F6F7F8]" />

      {/*<View className="mt-9 flex-row flex-wrap justify-between px-4">
        {loading || !hasAddress() ? (
          <>
            <LoadingWalletItem name={name} />
          </>
        ) : (
          [...accounts].map(([key, _]) => (
            <WalletMenuItem
              key={key}
              name={key}
              balance={getAccountBalance(key)}
              navigate={() => navigation.navigate('WalletTab', { account: key })}
            />
          ))
        )}

        <WalletMenuAdd navigate={() => {}} />
          </View>*/}

      <View className="mt-32 items-center justify-center">
        <Text className="font-manrope-medium text-xs text-grey">Here are all you pockets.</Text>
        <Text className=" font-manrope-medium text-xs text-grey">
          Create as many pockets as you like.
        </Text>
        <Pressable
          className="mt-2 active:opacity-70"
          onPress={() => navigation.navigate('CreatePocket')}>
          <Text className="text-center font-manrope text-sm font-bold text-[#0AAFFF]">
            Create pocket
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Pockets;
