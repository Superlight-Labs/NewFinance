import { StackScreenProps } from '@react-navigation/stack';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useBip32State } from 'state/bip32.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { apiUrl } from 'utils/superlight-api';

import { Text, TextInput } from 'utils/wrappers/styled-react-native';
type Props = StackScreenProps<RootStackParamList, 'Create'>;

const CreateWallet = ({ navigation }: Props) => {
  const [withPhrase, setWithPhrase] = useState(false);
  const [walletName, setWalletName] = useState('');
  const { user } = useAuthState();
  const { perform } = useFailableAction();
  const { generateGenericSecret } = useGenericSecret();
  const { setSecret, setName, derivedUntilLevel } = useBip32State();

  useEffect(() => {
    if (derivedUntilLevel !== 0) {
      navigation.navigate('ReviewCreate', { withPhrase: false });
    }
  }, []);

  const startGenerateWallet = () => {
    if (!user) {
      navigation.navigate('Welcome');
      return;
    }

    if (withPhrase) {
      const phrase = bip39.generateMnemonic(wordlist);

      navigation.navigate('ReviewCreate', {
        withPhrase: true,
        phrase,
      });
      return;
    }

    perform(
      generateGenericSecret({
        baseUrl: apiUrl,
        sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
      })
    ).onSuccess(result => {
      setName(walletName || 'Main Wallet');
      setSecret({
        peerShareId: result.peerShareId,
        share: result.share,
        path: 'secret',
      });
      navigation.navigate('ReviewCreate', { withPhrase: false });
    });
  };

  return (
    <Layout>
      <ButtonComponent
        style="px-6 py-3 absolute right-8 -top-12 rounded-xl"
        onPress={startGenerateWallet}>
        Next
      </ButtonComponent>
      <Title style="mb-4">Configure your new Wallet</Title>
      <Text className="mb-2 mr-4">Show the used Seed Phrase</Text>
      <Switch value={withPhrase} onValueChange={setWithPhrase} />
      <Text className="mr-4 mt-8">Set the Name for your Wallet</Text>
      <TextInput
        className="border-800 h-8 w-64 border-b"
        defaultValue="Main Wallet"
        value={walletName}
        onChangeText={setWalletName}
      />
    </Layout>
  );
};

export default CreateWallet;
