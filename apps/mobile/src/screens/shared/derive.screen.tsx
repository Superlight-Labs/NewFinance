import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { DerivedUntilLevel, useBip32State } from 'state/bip32.state';
import { AnimatedView, View } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Derive'>;

const DeriveScreen = ({ navigation }: Props) => {
  const createBitcoinWallet = useCreateBitcoinWallet();
  const { secret, derivedUntilLevel } = useBip32State();

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
          style={{ width: `${loadingCreateUntil(derivedUntilLevel)}%` }}></AnimatedView>
      </View>
    </LayoutComponent>
  );
};

const loadingCreateUntil = (derivedUntilLevel: DerivedUntilLevel): number => {
  switch (derivedUntilLevel) {
    case 0:
      return 0;
    case 1:
      return 10;
    case 2:
      return 30;
    case 3:
      return 50;
    case 4:
      return 70;
    case 5:
      return 90;
    case 6:
      return 95;
    case 7:
      return 100;
  }

  return 0;
};

export default DeriveScreen;
