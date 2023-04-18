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
    setTransactions,
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
      loadWalletData();
    }
  }, [address]);

  const loadWalletData = () => {
    setRefreshing(true);
    let loadBalance = true;
    let loadTransactions = true;

    const bs = new BitcoinService(network);

    bs.getBalance(address, BitcoinProviderEnum.TATUM).then(fetchedBalance => {
      loadBalance = false;
      updateBalance(fetchedBalance);
      setRefreshing(loadBalance || loadTransactions);
    });

    const query = new URLSearchParams({
      pageSize: '5',
      offset: '0',
    });

    bs.getTransactions(address, query, BitcoinProviderEnum.TATUM).then(fetchedTransactions => {
      loadTransactions = false;
      setTransactions(fetchedTransactions);
      setRefreshing(loadBalance || loadTransactions);
    });
  };

  const refreshControl = loading ? undefined : (
    <RefreshControl refreshing={refreshing} onRefresh={loadWalletData} />
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
          navigate={() => navigation.navigate('Wallet')}
        />
      </ScrollView>
    </LayoutComponent>
  );
};

export default Home;
