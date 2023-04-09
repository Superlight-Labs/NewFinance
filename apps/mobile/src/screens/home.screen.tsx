import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { RootStackParamList } from 'screens/main-navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  return (
    <LayoutComponent hideBack settingsNavigate={() => navigation.navigate('Menu')}>
      <Title>Wallets</Title>

      <WalletMenuItem navigate={() => navigation.navigate('Wallets')} />
    </LayoutComponent>
  );
};

export default Home;
