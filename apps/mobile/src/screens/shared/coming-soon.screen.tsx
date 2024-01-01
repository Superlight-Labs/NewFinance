import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { RootStackParamList } from 'src/app-navigation';
import { AnimatedView, Image, Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'ComingSoon'>;

const ComingSoonScreen = ({ navigation, route }: Props) => {
  const { text } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      navigation.pop();
    }, 55);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 300,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="h-full">
      <View className="h-full items-center text-center">
        <AnimatedView
          className="h-full w-full bg-black"
          style={{
            opacity: fadeAnim,
          }}>
          <Pressable onPress={closeModal} className="h-full w-full" />
        </AnimatedView>
        <View className="absolute bottom-0 w-full items-center rounded-t bg-white px-5 pb-10 pt-12 text-center shadow-2xl">
          <Image
            source={require('../../../assets/images/coming_soon.png')}
            resizeMode="cover"
            className="h-12 w-12"
          />
          <Text className="mt-8 font-[system] text-[32px] font-[700] leading-[32px] text-black">
            {text}
          </Text>
          <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
            available soon
          </Text>
          <Text className="mt-3 text-center font-manrope text-sm font-medium text-grey">
            Discover many more features soon. Look forward to Buy/Sell Bitcoin with lowest fees and
            use it banking compatible.
          </Text>
          <View className="mt-8 w-full">
            <ButtonComponent onPress={closeModal} style="bg-[#3385FF]" textStyle="text-white">
              Ok
            </ButtonComponent>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ComingSoonScreen;
