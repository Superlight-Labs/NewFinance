import { StackScreenProps } from '@react-navigation/stack';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { useGenericSecret } from '@superlight/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useBip32State } from 'state/bip32.state';
import { signWithDeviceKey } from 'util/auth';
import { apiUrl } from 'util/superlight-api';
import { mnemonicToSeed } from 'util/wrappers/bip32-neverthrow';
import { Text, TextInput } from 'util/wrappers/styled-react-native';
type Props = StackScreenProps<RootStackParamList, 'Create'>;

const CreateWallet = ({ navigation }: Props) => {
  const [showSeed, setShowSeed] = useState(false);
  const [walletName, setWalletName] = useState('');
  const { user } = useAuthState();
  const { perform } = useFailableAction();
  const { generateGenericSecret, importGenericSecret } = useGenericSecret();
  const { create } = useBip32State();

  const startGenerateWallet = () => {
    if (user === undefined) {
      navigation.navigate('Welcome');
      return;
    }

    perform(
      generateGenericSecret(
        apiUrl,
        signWithDeviceKey({ userId: user.id, devicePublicKey: user.devicePublicKey })
      )
    ).onSuccess(result => {
      create({ peerShareId: result.serverId, share: result.share, path: 'secret' });
      navigation.navigate('ReviewCreate', { showSeed, walletName });
    });
  };

  const startGenerateWalletWithSeed = () => {
    if (user == undefined) {
      navigation.navigate('Welcome');
      return;
    }

    const seed = bip39.generateMnemonic(wordlist);

    perform(mnemonicToSeed(seed))
      .andThen(
        importGenericSecret(
          apiUrl,
          signWithDeviceKey({ userId: user.id, devicePublicKey: user.devicePublicKey }),
          Buffer.from(bip39.mnemonicToSeedSync(seed)).toString('hex')
        )
      )
      .onSuccess(result => {
        create({ peerShareId: result.serverId, share: result.share, path: 'secret' });
        navigation.navigate('ReviewCreate', { showSeed, walletName, seed });
      });
  };

  return (
    <Layout>
      <ButtonComponent
        style="px-6 py-3 absolute right-8 -top-12 rounded-xl"
        onPress={showSeed ? startGenerateWalletWithSeed : startGenerateWallet}>
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
