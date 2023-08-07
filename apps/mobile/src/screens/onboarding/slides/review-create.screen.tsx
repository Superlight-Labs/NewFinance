import { API_URL } from '@env';
import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import RecoveryPhraseDisplayComponent from 'components/wallets/create/recovery-phrase-display.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useDeriveState } from 'state/derive.state';
import { useSnackbarState } from 'state/snackbar.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { mnemonicToSeed } from 'utils/wrappers/bip32-neverthrow';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'ReviewCreate'>;

const ReviewCreate = ({ navigation, route }: Props) => {
  const { withPhrase, phrase } = route.params;
  const { setSecret, name, derivedUntilLevel } = useDeriveState();
  const [loading, setLoading] = useState(false);
  const { importGenericSecret } = useGenericSecret();
  const { user, isAuthenticated } = useAuthState();
  const { perform } = useFailableAction();
  const { setMessage } = useSnackbarState();

  const finishGenerate = () => {
    if (!isAuthenticated) {
      setMessage({ message: "You're not authenticated", level: 'warning' });
      return;
    }
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (!withPhrase || !phrase || !user || derivedUntilLevel > 1) return;

    // Only executed if use decides to use a seed phrase
    // We do this because the `mnemonicToSeed` function is very slow and blocks the UI thread
    setLoading(true);

    const importSecret = mnemonicToSeed(phrase).andThen(secret =>
      importGenericSecret(
        {
          baseUrl: API_URL,
          sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
        },
        Buffer.from(secret).toString('hex')
      )
    );
    perform(importSecret).onSuccess(result => {
      setSecret({
        peerShareId: result.peerShareId,
        share: result.share,
        path: 'secret',
      });

      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <ButtonComponent
        style="absolute right-8 -top-8 rounded-xl"
        onPress={finishGenerate}
        disabled={loading}>
        Finish
      </ButtonComponent>
      <Title style="mb-4">Review Settings and finish</Title>

      <View className="flex w-full flex-row items-center border-b border-b-slate-200 py-2">
        <View className="flex-1">
          <Text className="font-inter-medium">Wallet Name</Text>
          <Text className="border-b-0">{name}</Text>
        </View>
        <View className="flex h-12 w-12 items-center justify-center rounded-lg bg-black p-3">
          <MonoIcon color="white" iconName="Wallet" />
        </View>
      </View>

      {withPhrase && phrase && <RecoveryPhraseDisplayComponent phrase={phrase} />}

      {loading && (
        <View className="mt-6 flex items-center justify-center">
          <MonoIcon iconName="Loading" />
        </View>
      )}
    </Layout>
  );
};

export default ReviewCreate;
