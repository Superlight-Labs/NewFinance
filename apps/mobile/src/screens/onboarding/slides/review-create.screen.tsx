import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineText from 'components/shared/input/multiline-text/multiline-text.component';
import Layout from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useDeriveState } from 'state/derive.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { apiUrl } from 'utils/superlight-api';
import { mnemonicToSeed } from 'utils/wrappers/bip32-neverthrow';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'ReviewCreate'>;

const ReviewCreate = ({ navigation, route }: Props) => {
  const { withPhrase, phrase } = route.params;
  const { setSecret, name, derivedUntilLevel } = useDeriveState();
  const [loading, setLoading] = useState(false);
  const { importGenericSecret } = useGenericSecret();
  const { user } = useAuthState();
  const { perform } = useFailableAction();

  const finishGenerate = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (!withPhrase || !phrase || !user || derivedUntilLevel !== 0) return;

    // Only executed if use decides to use a seed phrase
    // We do this because the `mnemonicToSeed` function is very slow and blocks the UI thread
    setLoading(true);

    const importSecret = mnemonicToSeed(phrase).andThen(secret =>
      importGenericSecret(
        {
          baseUrl: apiUrl,
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
        style="px-6 py-3 absolute right-8 -top-8 rounded-xl"
        onPress={finishGenerate}
        disabled={loading}>
        Finish
      </ButtonComponent>
      <Title style="mb-4">Review Settings and finish</Title>

      <Text>Name: {name}</Text>
      {withPhrase && phrase && <MultilineText value={phrase} disabled />}

      {loading && (
        <View className="mt-6 flex items-center justify-center">
          <MonoIcon iconName="Loading" />
        </View>
      )}
    </Layout>
  );
};

export default ReviewCreate;
