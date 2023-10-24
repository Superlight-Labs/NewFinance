import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import WelcomeCarousel from 'components/welcome-screen/welcome-carousel.component';
import { styled } from 'nativewind';
import { View } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';

const StyledView = styled(View);

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {
  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <WelcomeCarousel />
      <StyledView className="w-full px-4">
        <Button onPress={() => navigation.navigate('Onboarding')}>CREATE ACCOUNT</Button>
      </StyledView>
    </StyledView>
  );
};

export default Welcome;
