import { StackScreenProps } from '@react-navigation/stack';
import { useGenerateGenericSecret } from '@superlight/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { signWithDeviceKey } from 'util/auth';
import { apiUrl } from 'util/superlight-api';
import { Text, TextInput } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Create'>;

const CreateWallet = ({ navigation }: Props) => {
  const { user } = useAuthState();
  const [showSeed, setShowSeed] = useState(false);
  const [walletName, setWalletName] = useState('');
  const { perform } = useFailableAction();
  const { generateGenericSecret } = useGenerateGenericSecret();

  const startGenerateWallet = () => {
    if (user == undefined) {
      navigation.navigate('Welcome');
      return;
    }

    perform(
      generateGenericSecret(
        apiUrl,
        signWithDeviceKey({ userId: user.id, devicePublicKey: user.devicePublicKey })
      )
    ).onSuccess(share => {
      console.log('This is the share', share);
      navigation.navigate('ReviewCreate', { showSeed, walletName });
    });
  };

  return (
    <Layout>
      <ButtonComponent
        style="px-6 py-3 absolute right-8 -top-12 rounded-xl"
        onPress={startGenerateWallet}>
        Next
      </ButtonComponent>
      <Title>Configure your new Wallet</Title>
      <Text className="mb-2 mr-4">Show the used Seed Phrase</Text>
      <Switch value={showSeed} onValueChange={setShowSeed} />
      <Text className="mr-4 mt-8">Set the Name for your Wallet</Text>
      <TextInput
        className="border-800 h-8 w-64 border-b"
        value={walletName}
        onChangeText={setWalletName}
      />
    </Layout>
  );
};

export default CreateWallet;
