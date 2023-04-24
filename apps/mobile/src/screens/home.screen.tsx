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
import { ScrollView } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel, name } = useDeriveState();
  const { accounts, getAccountBalance, getTotalBalance, hasAddress } = useBitcoinState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (derivedUntilLevel < DerivedUntilLevel.COMPLETE) {
      setLoading(true);
      createBitcoinWallet(secret).onSuccess(_ => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (derivedUntilLevel === DerivedUntilLevel.COMPLETE) {
      update();
    }
  }, [derivedUntilLevel]);

  const { refreshing, update } = useUpdateWalletData();

  const refreshControl = loading ? undefined : (
    <RefreshControl refreshing={refreshing} onRefresh={update} />
  );

  return (
    <LayoutComponent
      hideBack
      noPadding
      style="pl-8"
      settingsNavigate={() => navigation.navigate('Menu')}>
      <ScrollView className="h-full" refreshControl={refreshControl}>
        <Title>Wallets</Title>

        <Title style="mb-4">{getTotalBalance()} BTC</Title>
        {loading || !hasAddress() ? (
          <LoadingWalletItem name={name} />
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
    </LayoutComponent>
  );
};

export default Home;
