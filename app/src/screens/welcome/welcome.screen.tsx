import Button from 'components/shared/input/button/button.component';
import WelcomeCarousel from 'components/welcome-screen/welcome-carousel.component';
import {styled} from 'nativewind';
import {View} from 'react-native';

const StyledView = styled(View);

const Welcome = () => {
  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <WelcomeCarousel />
      <StyledView className="w-full px-4">
        <Button style="flex flex-row justify-center w-full" onPress={() => {}}>
          Get started
        </Button>
      </StyledView>
    </StyledView>
  );
};

export default Welcome;
