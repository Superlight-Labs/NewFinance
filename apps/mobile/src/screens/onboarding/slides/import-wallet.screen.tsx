import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import Layout from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import RecoveryPhraseInputComponent from 'components/wallets/create/recovery-phrase-input.component';
import { useEffect, useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Import'>;

const ImportWallet = ({ navigation }: Props) => {
  const [walletName, setWalletName] = useState('Main Wallet');
  const [seedPhrase, setPhrase] = useState('');
  const { deleteBip32, derivedUntilLevel, setName } = useDeriveState();

  useEffect(() => {
    if (derivedUntilLevel !== DerivedUntilLevel.NONE) {
      deleteBip32();
    }
  }, [seedPhrase]);

  const { user } = useAuthState();

  const startGenerateWallet = () => {
    if (!user) {
      navigation.navigate('Welcome');
      return;
    }

    setName(walletName);

    navigation.navigate('ReviewCreate', {
      withPhrase: true,
      phrase: seedPhrase,
    });
  };

  return (
    <Layout>
      <ButtonComponent
        style="absolute right-8 -top-12 rounded-xl"
        disabled={!seedPhrase}
        onPress={startGenerateWallet}>
        Next
      </ButtonComponent>
      <Title>Configure your new Wallet</Title>
      <View className="flex w-full flex-row items-center border-b border-b-slate-200 py-2">
        <View className="flex-1">
          <Text className="font-inter-medium">Wallet Name</Text>
          <TextInputComponent
            style="border-b-0"
            placeHolder="Main Wallet"
            defaultValue="Main Wallet"
            value={walletName}
            onChangeText={setWalletName}
          />
        </View>
        <View className="flex h-12 w-12 items-center justify-center rounded-lg bg-black p-3">
          <MonoIcon color="white" iconName="Wallet" />
        </View>
      </View>

      <RecoveryPhraseInputComponent setPhrase={setPhrase} />
    </Layout>
  );
};

export default ImportWallet;
