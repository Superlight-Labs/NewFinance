import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import WalletMenuItem from 'components/wallets/wallet-item/wallet-menu-item.component';
import { RootStackParamList } from 'screens/main-navigation';
import { Pressable, View } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  return (
    <View className="flex h-full w-full flex-col p-8 pt-16">
      <Pressable
        className="ml-auto flex w-12 items-center justify-center"
        onPress={() => navigation.navigate('Menu')}>
        <MonoIcon iconName="Settings" />
      </Pressable>
      <Title>Wallets</Title>

      <WalletMenuItem navigate={() => navigation.navigate('Wallets')} />
    </View>
  );
};

export default Home;
