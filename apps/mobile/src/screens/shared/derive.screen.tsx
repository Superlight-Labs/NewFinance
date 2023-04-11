import { StackScreenProps } from '@react-navigation/stack';
import logger from '@superlight/logger';
import { useDerive } from '@superlight/rn-mpc-client';
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { signWithDeviceKey } from 'util/auth';
import { apiUrl } from 'util/superlight-api';

type Props = StackScreenProps<RootStackParamList, 'Derive'>;

const DeriveScreen = ({ route, navigation }: Props) => {
  const { user } = useAuthState();
  const { path: _, fromShare, peerShareId } = route.params;
  const { deriveBip32 } = useDerive();
  const { perform } = useFailableAction();

  useEffect(() => {
    if (!user) return;

    perform(
      deriveBip32(
        apiUrl,
        signWithDeviceKey({ userId: user.id, devicePublicKey: user.devicePublicKey }),
        { share: fromShare, peerShareId, index: 'm' }
      ),
      () => navigation.navigate('Onboarding')
    ).onSuccess(result => logger.info({ result }, 'Derive success'));
  }, []);

  return (
    <LayoutComponent hideBack style=" justify-center items-center h-full bg-teal-300">
      <Title style="text-white font-extrabold">Loading...</Title>
    </LayoutComponent>
  );
};

export default DeriveScreen;
