import { StackScreenProps } from '@react-navigation/stack';
import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { useBitcoinState } from 'state/bitcoin.state.';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel, name } = useBip32State();
  const {
    network,
    updateBalance,
    indexAddress: { balance, address },
  } = useBitcoinState();

  const loading = derivedUntilLevel < DerivedUntilLevel.COMPLETE;

  useEffect(() => {
    if (!secret) {
      navigation.navigate('Onboarding');
      return;
    }

    if (loading) {
      createBitcoinWallet(secret.share, secret.peerShareId);
    }
  }, []);

  useEffect(() => {
    if (address) {
      new BitcoinService(network)
        .getBalance(address, BitcoinProviderEnum.TATUM)
        .then(fetchedBalance => {
          updateBalance(fetchedBalance);
        });
    }
  }, [address]);

  return (
    <LayoutComponent
      hideBack
      noPadding
      style="bg-white pl-8"
      settingsNavigate={() => navigation.navigate('Menu')}>
      <Title>Wallets</Title>

      <Title style="mb-4">{balance ? balance.incoming - balance.outgoing : 0} BTC</Title>

      <WalletMenuItem
        name={name}
        loading={loading}
        balance={balance}
        navigate={() => navigation.navigate('Wallets')}
      />
    </LayoutComponent>
  );
};

export default Home;
