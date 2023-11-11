import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import LoadingWalletItem from 'components/wallets/wallet-item/loading-wallet-item.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';

import { Image, Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
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

  return (
    <ScrollView
      className="h-full bg-white"
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      horizontal={false}>
      <View className="px-6">
        <PriceTextComponent
          style="font-manrope-bold text-3xl text-black"
          bitcoinAmount={getTotalBalance()}
        />

        <View className="flex-row items-center">
          <MonoIcon iconName="ArrowDown" width={16} height={16} color={'#FF000F'} />

          <Text className="text-red font-manrope text-sm font-semibold">4,12€ (0,12%)</Text>
          <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
          <Text className="font-manrope text-sm font-semibold text-grey">1 month</Text>
        </View>
      </View>
      <View className="mb-4 mt-10 flex-row items-center justify-between px-6">
        <Text className="font-manrope text-base font-bold">Bitcoin pockets</Text>
        <Pressable className="active:opacity-70">
          <Text className=" font-manrope text-sm font-semibold">+ Add new pocket</Text>
        </Pressable>
      </View>
      <View className="px-6">
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
      </View>
      <View className="mb-4 mt-10 flex-row items-center justify-between px-6">
        <Text className="font-manrope text-base font-bold">Money pockets</Text>
        <Pressable className="active:opacity-70">
          <Text className=" font-manrope text-sm font-semibold">+ Add new pocket</Text>
        </Pressable>
      </View>
      <View className="px-6">
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
      </View>

      <View className="my-12 ml-[-1.5rem] h-3 w-full bg-[#F6F6F8]"></View>

      <Pressable className="mb-12 flex-row items-center justify-between px-6 active:opacity-70">
        <View className="flex-row items-center ">
          <Image
            source={require('../../../assets/images/logo.png')}
            resizeMode="contain"
            className="mr-2 mt-0.5 h-6 w-6"
          />
          <Text className="font-manrope text-lg font-semibold">Card</Text>
        </View>

        <View className="flex-row">
          <Text className=" font-manrope text-sm font-semibold text-[#0AAFFF]">Coming soon</Text>
          <View className="mt-0.5">
            <MonoIcon iconName="ChevronRight" width={18} height={18} />
          </View>
        </View>
      </Pressable>

      <Pressable className="flex-row items-center justify-between px-6 active:opacity-70">
        <View className="flex-row items-center ">
          <Text className="font-manrope text-lg font-semibold">Testing benefits</Text>
        </View>

        <View className="flex-row">
          <View className="mt-0.5">
            <MonoIcon iconName="ChevronRight" width={18} height={18} />
          </View>
        </View>
      </Pressable>

      <View className="my-12 ml-[-1.5rem] h-3 w-full bg-[#F6F6F8]"></View>
    </ScrollView>
  );
};

export default Pockets;
