import Carousel from 'components/shared/carousel/carousel.component';
import {Text, View} from 'custom/styled-react-native';

const WelcomeCarousel = () => {
  return (
    <View className="flex flex-1 flex-col">
      <Carousel>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>Hi</Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>this</Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>will</Text>
        </View>
        <View className="flex w-full flex-1 flex-col items-center justify-center">
          <Text>explain</Text>
        </View>
      </Carousel>
    </View>
  );
};

export default WelcomeCarousel;
