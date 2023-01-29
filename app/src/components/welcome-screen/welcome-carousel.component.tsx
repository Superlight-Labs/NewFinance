import Carousel from 'components/shared/carousel/carousel.component';
import {styled} from 'nativewind';
import {Text, View} from 'react-native';

const StyledView = styled(View);

const WelcomeCarousel = () => {
  return (
    <StyledView className="flex flex-1 flex-col">
      <Carousel>
        <StyledView className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>Hi</Text>
        </StyledView>
        <StyledView className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>this</Text>
        </StyledView>
        <StyledView className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>will</Text>
        </StyledView>
        <StyledView className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>explain</Text>
        </StyledView>
      </Carousel>
    </StyledView>
  );
};

export default WelcomeCarousel;
