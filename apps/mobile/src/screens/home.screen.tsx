import { StackScreenProps } from '@react-navigation/stack';
import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';
import { ScrollView } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel, name } = useBip32State();
  const {
    network,
    updateBalance,
    indexAddress: { balance, address },
  } = useBitcoinState();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      loadBalance();
    }
  }, [address]);

  const loadBalance = () => {
    setRefreshing(true);

    new BitcoinService(network)
      .getBalance(address, BitcoinProviderEnum.TATUM)
      .then(fetchedBalance => {
        updateBalance(fetchedBalance);
        setRefreshing(false);
      });
  };

  const refreshControl = loading ? undefined : (
    <RefreshControl refreshing={refreshing} onRefresh={loadBalance} />
  );

  return (
    <LayoutComponent
      hideBack
      noPadding
      style="pl-8"
      settingsNavigate={() => navigation.navigate('Menu')}>
      <ScrollView className="h-full" refreshControl={refreshControl}>
        <Title>Wallets</Title>

        <Title style="mb-4">{balance ? balance.incoming - balance.outgoing : 0} BTC</Title>

        <WalletMenuItem
          name={name}
          loading={loading || refreshing || !balance}
          balance={balance}
          navigate={() => navigation.navigate('Wallets')}
        />
      </ScrollView>
    </LayoutComponent>
  );
};

export default Home;
