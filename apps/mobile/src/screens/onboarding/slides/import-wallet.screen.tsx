import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineText from 'components/shared/input/multiline-text/multiline-text.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';

import { Text, TextInput } from 'util/wrappers/styled-react-native';
type Props = StackScreenProps<RootStackParamList, 'Create'>;

const ImportWallet = ({ navigation }: Props) => {
  const [walletName, setWalletName] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const { user } = useAuthState();

  const startGenerateWallet = () => {
    if (!user) {
      navigation.navigate('Welcome');
      return;
    }

    navigation.navigate('ReviewCreate', {
      withPhrase: true,
      walletName,
      phrase: seedPhrase,
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
      <Text className="mb-2 mr-4">Enter your existing seed phrase</Text>
      <MultilineText
        setValue={setSeedPhrase}
        value={seedPhrase}
        placeholder="12 to 24 word seed phrase"
      />
      <Text className="mr-4 mt-8">Set the Name for your Wallet</Text>
      <TextInput
        className="border-800 h-8 w-64 border-b"
        value={walletName}
        onChangeText={setWalletName}
      />
    </Layout>
  );
};

export default ImportWallet;
