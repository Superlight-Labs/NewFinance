import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useBip32State } from 'state/bip32.state';
import { Text } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const Onboarding = ({ navigation }: Props) => {
  const { derivedUntilLevel, hasHydrated } = useBip32State();

  useEffect(() => {
    if (hasHydrated && derivedUntilLevel !== 0) {
      navigation.navigate('ReviewCreate', { withPhrase: false });
    }
  }, [hasHydrated]);
  return (
    <Layout hideBack settingsNavigate={() => navigation.navigate('Menu')}>
      <Title>Onboarding</Title>

      <Text>Hello, welcome to Superlight. Next step is to create your wallet.</Text>
      <Text className="mb-24">
        You can either generate a new one, or import an existing wallet by your passphrase
      </Text>

      <Button
        shadow
        onPress={function (): void {
          navigation.navigate('Create');
        }}>
        Create new Wallet
      </Button>
      <Button
        shadow
        style="my-4"
        onPress={function (): void {
          navigation.navigate('Import');
        }}>
        Import Existing Wallet
      </Button>
    </Layout>
  );
};

export default Onboarding;
