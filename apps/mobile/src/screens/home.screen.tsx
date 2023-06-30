import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import LoadingWalletItem from 'components/wallets/wallet-item/loading-wallet-item.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useBitcoinState } from 'state/bitcoin.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { Image, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel, name } = useDeriveState();
  const { accounts, getAccountBalance, getTotalBalance, hasAddress } = useBitcoinState();
  const [loading, setLoading] = useState(false);
  const { refreshing, update } = useUpdateWalletData();

  useEffect(() => {
    if (derivedUntilLevel < DerivedUntilLevel.COMPLETE) {
      setLoading(true);
      createBitcoinWallet(secret).onSuccess(_ => {
        setLoading(false);
        updateAll();
      });
    }
  }, []);

  const updateAll = () => {
    for (const [key, _] of accounts) {
      update(key);
    }
  };

  const refreshControl = loading ? undefined : (
    <RefreshControl refreshing={refreshing} onRefresh={updateAll} />
  );

  return (
    <LayoutComponent hideBack noPadding settingsNavigate={() => navigation.navigate('Menu')}>
      <ScrollView className="h-full pl-8" refreshControl={refreshControl}>
        <Title>Wallets</Title>

        <Title style="mb-4">{getTotalBalance()} BTC</Title>
        {loading || !hasAddress() ? (
          <>
            <LoadingWalletItem name={name} />
            <View className="mr-8 flex items-center justify-center self-center">
              <Text className="mt-24 flex items-center justify-center text-center font-manrope-bold text-blue-800">
                Your Wallet is currently being created for you. This can take a few moments...
              </Text>
            </View>
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
      <Image
        className="absolute bottom-[15%] left-0 h-72 w-screen"
        source={require('../../assets/images/lines-2.png')}
      />
    </LayoutComponent>
  );
};

export default Home;
