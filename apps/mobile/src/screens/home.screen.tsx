import { StackScreenProps } from '@react-navigation/stack';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { RootStackParamList } from 'screens/main-navigation';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  return (
    <Layout style="flex h-full w-full flex-col p-8 pt-24">
      <Title>Wallets</Title>

      <WalletMenuItem navigate={() => navigation.navigate('Wallets')} />
    </Layout>
  );
};

export default Home;
