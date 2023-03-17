import { StackScreenProps } from '@react-navigation/stack';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { RootStackParamList } from 'src/util/navigation/main-navigation';
import { View } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

const Home = ({ navigation }: Props) => {

  return (
    <View className="flex h-full w-full flex-col p-8 pt-24">
      <Title>Wallets</Title>

      <WalletMenuItem navigate={() => navigation.navigate('Wallet')} />
    </View>
  );
};

export default Home;
