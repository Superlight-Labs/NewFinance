import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import WelcomeCarousel from 'components/welcome-screen/welcome-carousel.component';
import { styled } from 'nativewind';
import { View } from 'react-native';
import { RootStackParamList } from 'src/util/navigation/main-navigation';

const StyledView = styled(View);

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {
  // const createProfile = useCreateAuth();

  // const getStarted = useCallback(() => {
  //   // TODO use neverthrow for failable stuff
  //   getKey(constants.deviceKeyName)
  //     .then(key =>
  //       console.warn('Key exists even though it should not exist here')
  //     )
  //     .catch(async _ => {
  //       const newDevicePublicKey = await generateKeyPair(
  //         constants.deviceKeyName
  //       );

  //       createProfile(newDevicePublicKey);
  //     });
  // }, [navigation]);

  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <WelcomeCarousel />
      <StyledView className="w-full px-4">
        <Button
          style="flex flex-row justify-center w-full"
          onPress={() => navigation.navigate('Home')}>
          Get started
        </Button>
      </StyledView>
    </StyledView>
  );
};

export default Welcome;
