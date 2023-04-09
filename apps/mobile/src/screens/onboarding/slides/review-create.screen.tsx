import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight/rn-mpc-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useBip32State } from 'state/bip32.state';
import { signWithDeviceKey } from 'util/auth';
import { apiUrl } from 'util/superlight-api';
import { mnemonicToSeed } from 'util/wrappers/bip32-neverthrow';
import { Text } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'ReviewCreate'>;

const ReviewCreate = ({ navigation, route }: Props) => {
  const { walletName, withPhrase, phrase } = route.params;
  const { create, hasBip32State } = useBip32State();
  const [loading, setLoading] = useState(false);
  const { importGenericSecret } = useGenericSecret();
  const { user } = useAuthState();
  const { perform } = useFailableAction();

  const finishGenerate = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (!withPhrase || !phrase || !user || hasBip32State) return;

    // Only executed if use decides to use a seed phrase
    // We do this because the `mnemonicToSeed` function is very slow and blocks the UI thread
    setLoading(true);

    const importSecret = mnemonicToSeed(phrase).andThen(secret =>
      importGenericSecret(
        apiUrl,
        signWithDeviceKey({ userId: user.id, devicePublicKey: user.devicePublicKey }),
        Buffer.from(secret).toString('hex')
      )
    );
    perform(importSecret).onSuccess(result => {
      create({
        peerShareId: result.serverId,
        share: result.share,
        path: 'secret',
        name: walletName,
      });

      setLoading(false);
    });
  }, []);

  return (
    <Layout hideBack>
      <ButtonComponent
        style="px-6 py-3 absolute right-8 -top-8 rounded-xl"
        onPress={finishGenerate}
        disabled={loading}>
        Finish
      </ButtonComponent>
      <Title>Review Settings and finish</Title>

      <Text>Name: {walletName}</Text>
      {withPhrase && <Text>Seed: {phrase}</Text>}

      {loading && <Text>Loading...</Text>}
    </Layout>
  );
};

export default ReviewCreate;
