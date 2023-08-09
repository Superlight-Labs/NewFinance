import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { RootStackParamList } from 'screens/main-navigation';
import { Image, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'SetupWallet'>;

const SetupWallet = ({ navigation }: Props) => {
  return (
    <Layout
      style="flex w-screen flex-col"
      hideBack
      settingsNavigate={() => navigation.navigate('Menu')}>
      <Title style="mb-4">Onboarding</Title>

      <Text className="my-8 font-inter">
        Hello, welcome to Superlight. Next step is to create your wallet.
      </Text>

      <Button
        style="py-3 mt-auto"
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

      <View className="mt-8 flex w-full flex-1 flex-col items-center">
        <Image
          className="h-72 w-screen"
          source={require('../../../../assets/images/lines-2.png')}
        />
      </View>
    </Layout>
  );
};

export default SetupWallet;
