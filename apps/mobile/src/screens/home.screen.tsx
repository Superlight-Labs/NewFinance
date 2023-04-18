import { StackScreenProps } from '@react-navigation/stack';
import logger from '@superlight-labs/logger';
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
  const { indexAddress } = useBitcoinState();

  const loading = derivedUntilLevel < DerivedUntilLevel.COMPLETE;

  useEffect(() => {
    if (!secret) {
      navigation.navigate('Onboarding');
      return;
    }

    if (loading) {
      createBitcoinWallet(secret.share, secret.peerShareId).onSuccess(_ =>
        logger.info('Done, now we could fetch the balance')
      );
    }
  }, []);

  return (
    <LayoutComponent
      hideBack
      noPadding
      style="bg-white pl-8"
      settingsNavigate={() => navigation.navigate('Menu')}>
      <Title>Wallets</Title>

      <Title style="mb-4">0 BTC</Title>

      <WalletMenuItem
        name={name}
        loading={loading}
        balance={indexAddress.address}
        navigate={() => navigation.navigate('Wallets')}
      />
    </LayoutComponent>
  );
};

export default Home;
