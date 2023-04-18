import { StackScreenProps } from '@react-navigation/stack';
import { generateKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import Button from 'components/shared/input/button/button.component';
import WelcomeCarousel from 'components/welcome-screen/welcome-carousel.component';
import { useCreateAuth } from 'hooks/useCreateAuth';
import { useFailableAction } from 'hooks/useFailable';
import { styled } from 'nativewind';
import { useCallback } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { constants } from 'utils/constants';

const StyledView = styled(View);

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {
  const createProfile = useCreateAuth();
  const { authenticate } = useAuthState();
  const { perform } = useFailableAction();

  const getStarted = useCallback(async () => {
    const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);

    perform(createProfile(newDevicePublicKey)).onSuccess(user => {
      authenticate(user);
      navigation.navigate('Onboarding');
    });
  }, [navigation, authenticate, createProfile, perform]);

  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <WelcomeCarousel />
      <StyledView className="w-full px-4">
        <Button shadow style="flex flex-row justify-center w-full" onPress={getStarted}>
          Get started
        </Button>
      </StyledView>
    </StyledView>
  );
};

export default Welcome;
