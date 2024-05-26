import { StackScreenProps } from '@react-navigation/stack';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';

import LoadingWalletMainItem from 'components/wallets/wallet-item/loading-wallet-main-item.component';
import WalletMainItem from 'components/wallets/wallet-item/wallet-main-item.component';
import { RefreshControl } from 'react-native';
import { ScrollView, View } from 'utils/wrappers/styled-react-native';
import { PocketsStackParamList } from './pockets-navigation';

type Props = StackScreenProps<PocketsStackParamList, 'Pockets'>;

const Pockets = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet(() => {});
  const { secret, derivedUntilLevel, hasHydrated: deriveHydrated } = useDeriveState();
  const {
    accounts,
    getAccountBalance,
    hasAddress,
    setHasHydrated,
    hasHydrated: bitcoinHydrated,
  } = useBitcoinState();
  const { refreshing, update } = useUpdateWalletData();

  const loading = derivedUntilLevel < DerivedUntilLevel.COMPLETE;
  console.log({ deriveHydrated, bitcoinHydrated });

  useEffect(() => {
    if (!bitcoinHydrated && deriveHydrated) {
      console.log('!!! DIFF IN STATE HYDRATION. Try to uncomment line bellow !!!');
      setHasHydrated(true);
    }

    if (bitcoinHydrated && loading) {
      console.log('create bitcoin wallet');
      createBitcoinWallet(secret)(() => {
        updateAll();
      });
    }
  }, [bitcoinHydrated, deriveHydrated, loading]);

  const updateAll = () => {
    for (const [key, _] of accounts) {
      update(key);
    }
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
      {/*<View className="px-5">
        <PriceTextComponent
          style="font-[system] text-[32px] font-[700] leading-[32px] text-black"
          bitcoinAmount={getTotalBalance()}
        />
      </View>*/}

      <View className="mt-3 px-4">
        {loading || !hasAddress() ? (
          <>
            <LoadingWalletMainItem />
          </>
        ) : (
          <WalletMainItem
            key={'Main pocket'}
            account={'Main pocket'}
            balance={getAccountBalance('Main pocket')}
            navigate={() => navigation.navigate('Wallet', { account: 'Main pocket' })}
          />
        )}
      </View>

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
