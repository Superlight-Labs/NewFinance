import { styled } from 'nativewind';
import {
  Animated,
  Button as RNButton,
  Image as RNImage,
  ImageBackground as RNImageBackground,
  Pressable as RNPressable,
  SafeAreaView as RNSafeAreaView,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native';

const ScrollView = styled(RNScrollView);
const Text = styled(RNText, 'font-manrope text-base text-black');
const TextInput = styled(RNTextInput, 'font-manrope');
const Button = styled(RNButton);
const Pressable = styled(RNPressable);
const SafeAreaView = styled(RNSafeAreaView);
const View = styled(RNView);
const Image = styled(RNImage);
const AnimatedView = styled(Animated.View);
const ImageBackground = styled(RNImageBackground);

export {
  AnimatedView,
  Button,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
};
