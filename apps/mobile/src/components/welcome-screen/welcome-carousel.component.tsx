import Carousel from 'components/shared/carousel/carousel.component';
import { View } from 'utils/wrappers/styled-react-native';
import WelcomeSlide1 from './welcome-slide-1.component';
import WelcomeSlide2 from './welcome-slide-2.componen';
import WelcomeSlide3 from './welcome-slide-3component';
import WelcomeSlide4 from './welcome-slide-4.component';
import WelcomeSlide5 from './welcome-slide-5.component';

const WelcomeCarousel = () => {
  return (
    <View className="">
      <Carousel>
        <WelcomeSlide1 />
        <WelcomeSlide2 />
        <WelcomeSlide3 />
        <WelcomeSlide4 />
        <WelcomeSlide5 />
      </Carousel>
    </View>
  );
};

export default WelcomeCarousel;
