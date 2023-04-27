import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useDeriveState } from 'state/derive.state';
import { Text } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'SetupWallet'>;

const SetupWallet = ({ navigation }: Props) => {
  const { derivedUntilLevel, hasHydrated } = useDeriveState();

  useEffect(() => {
    if (hasHydrated && derivedUntilLevel !== 0) {
      navigation.navigate('ReviewCreate', { withPhrase: false });
    }
  }, [hasHydrated]);
  return (
    <Layout hideBack settingsNavigate={() => navigation.navigate('Menu')}>
      <Title style="mb-4">Onboarding</Title>

      <Text className=" font-inter">
        Hello, welcome to Superlight. Next step is to create your wallet.
      </Text>
      <Text className="mb-24 font-inter">
        You can either generate a new one, or import an existing wallet by your passphrase
      </Text>

      <Button
        style="py-3"
        shadow
        onPress={function (): void {
          navigation.navigate('Create');
        }}>
        Create new Wallet
      </Button>
      <Button
        shadow
        style="my-4 py-3"
        onPress={function (): void {
          navigation.navigate('Import');
        }}>
        Import Existing Wallet
      </Button>
    </Layout>
  );
};

export default SetupWallet;
