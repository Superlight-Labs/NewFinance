import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { CreatedUntil, useBip32State } from 'state/bip32.state';
import { AnimatedView, View } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Derive'>;

const DeriveScreen = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, createdUntil } = useBip32State();

  useEffect(() => {
    if (!secret) {
      navigation.navigate('Onboarding');
      return;
    }

    createBitcoinWallet(secret.share, secret.peerShareId).onSuccess(_ =>
      navigation.navigate('Home')
    );
  }, []);

  return (
    <LayoutComponent hideBack style="justify-center flex flex-col items-center h-full bg-slate-300">
      <Title style="text-white flex text-center items-center justify-center font-extrabold">
        Loading...
      </Title>

      <View className=" h-6 w-64 rounded-full bg-gray-200 dark:bg-gray-700">
        <AnimatedView
          className="h-6 rounded-full bg-blue-600 dark:bg-blue-500"
          style={{ width: `${loadingCreateUntil(createdUntil)}%` }}></AnimatedView>
      </View>
    </LayoutComponent>
  );
};

const loadingCreateUntil = (createdUntil: CreatedUntil): number => {
  switch (createdUntil) {
    case 'none':
      return 0;
    case 'secret':
      return 10;
    case 'master':
      return 30;
    case 'purpose':
      return 50;
    case 'coinType':
      return 70;
    case 'account':
      return 90;
    case 'change':
      return 95;
    case 'complete':
      return 100;
  }
};

export default DeriveScreen;
