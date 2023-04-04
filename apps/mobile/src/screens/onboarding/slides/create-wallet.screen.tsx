import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { RootStackParamList } from 'screens/main-navigation';
import { Text, TextInput } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Create'>;

const CreateWallet = ({ navigation }: Props) => {
  const [showSeed, setShowSeed] = useState(false);
  const [walletName, setWalletName] = useState('');

  const startGenerateWallet = () => {
    navigation.navigate('ReviewCreate', { showSeed, walletName });
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
