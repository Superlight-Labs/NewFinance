import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import LoadingWalletItem from 'components/wallets/wallet-item/loading-wallet-item.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { useGeneralState } from 'state/general.state';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const { user } = useAuthState();

  const { showedAlphaNotice, showAlphaNotice } = useGeneralState();
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
    if (hasAddress() && !showedAlphaNotice) {
      showAlphaNotice();
      navigation.navigate('AlphaNotice');
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
    <SafeAreaView>
      <View className="h-full px-4 pt-6">
        <Pressable className="mb-8 flex flex-row items-center">
          <Image
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
            className="mr-2 mt-0.5 h-6 w-6"
          />
          <Text className="font-manrope text-lg font-semibold">{user?.username}</Text>
          <View className="mt-0.5">
            <MonoIcon iconName="ChevronRight" width={18} height={18} />
          </View>
        </Pressable>
        <ScrollView className="h-full" refreshControl={refreshControl}>
          <Title>Total Balance</Title>

          <Title style="">{getTotalBalance()} BTC</Title>

          <View className="mb-8 flex-row items-center">
            <MonoIcon iconName="ArrowDown" width={16} height={16} color={'#FF000F'} />

            <Text className="text-red font-manrope text-sm font-semibold">4,12€ (0,12%)</Text>
            <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
            <Text className="font-manrope text-sm font-semibold text-grey">1 month</Text>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-manrope text-xl font-bold">Bitcoin pockets</Text>
            <Pressable>
              <Text className=" font-manrope text-base font-semibold">+ Add new pocket</Text>
            </Pressable>
          </View>
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
                navigate={() => navigation.navigate('Wallet', { account: key })}
              />
            ))
          )}

          <View className="mb-4 mt-8 flex-row items-center justify-between">
            <Text className="font-manrope text-xl font-bold">Money pockets</Text>
            <Pressable>
              <Text className=" font-manrope text-base font-semibold">+ Add new pocket</Text>
            </Pressable>
          </View>
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
                navigate={() => navigation.navigate('Wallet', { account: key })}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
