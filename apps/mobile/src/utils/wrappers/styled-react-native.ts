import { styled } from 'nativewind';
import {
  Animated,
  Button as RNButton,
  Pressable as RNPressable,
  SafeAreaView as RNSafeAreaView,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native';

const ScrollView = styled(RNScrollView);
const Text = styled(RNText, 'font-manrope text-base');
const TextInput = styled(RNTextInput, 'font-manrope');
const Button = styled(RNButton);
const Pressable = styled(RNPressable);
const SafeAreaView = styled(RNSafeAreaView);
const View = styled(RNView);
const AnimatedView = styled(Animated.View);

export { SafeAreaView, View, Pressable, Button, Text, ScrollView, AnimatedView, TextInput };
