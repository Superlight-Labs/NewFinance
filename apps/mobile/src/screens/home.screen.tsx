import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useUpdateWalletData } from 'hooks/useUpdateWalletData';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';
import { safeBalance } from 'utils/crypto/bitcoin-value';
import { ScrollView } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel, name } = useBip32State();
  const {
    indexAddress: { balance, address },
  } = useBitcoinState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!secret) {
      navigation.navigate('Onboarding');
      return;
    }

    if (derivedUntilLevel < DerivedUntilLevel.COMPLETE) {
      setLoading(true);
      createBitcoinWallet(secret.share, secret.peerShareId).onSuccess(_ => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (address) {
      update();
    }
  }, [address]);

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

        <Title style="mb-4">{balance ? safeBalance(balance) : 0} BTC</Title>

        <WalletMenuItem
          name={name}
          loading={loading || refreshing || !balance}
          balance={balance}
          navigate={() => navigation.navigate('Wallet')}
        />
      </ScrollView>
    </LayoutComponent>
  );
};

export default Home;
