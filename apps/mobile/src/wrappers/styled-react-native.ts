import {styled} from 'nativewind';
import {
  Button as RNButton,
  Pressable as RNPressable,
  SafeAreaView as RNSafeAreaView,
  ScrollView as RNScrollView,
  Text as RNText,
  View as RNView,
} from 'react-native';

const ScrollView = styled(RNScrollView);
const Text = styled(RNText, 'font-nunito');
const Button = styled(RNButton);
const Pressable = styled(RNPressable);
const SafeAreaView = styled(RNSafeAreaView);
const View = styled(RNView);

export {SafeAreaView, View, Pressable, Button, Text, ScrollView};
