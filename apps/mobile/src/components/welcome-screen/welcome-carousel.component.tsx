import Carousel from 'components/shared/carousel/carousel.component';
import { Text, View } from 'utils/wrappers/styled-react-native';

const WelcomeCarousel = () => {
  return (
    <View className="flex flex-1 flex-col">
      <Carousel>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>
            Hi, this carousel is yet to be built and will explain new users what the app is about
          </Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>page 2</Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>page 3</Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>page 4</Text>
        </View>
      </Carousel>
    </View>
  );
};

export default WelcomeCarousel;
