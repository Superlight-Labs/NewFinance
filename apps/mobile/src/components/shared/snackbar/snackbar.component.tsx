import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AppMessage, useSnackbarState } from 'state/snackbar.state';
import { AnimatedView, Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import MonoIcon from '../mono-icon/mono-icon.component';

type Props = {
  appMessage: AppMessage;
};

const Snackbar = ({ appMessage }: Props) => {
  const { message, level } = appMessage;
  const { resetMessage } = useSnackbarState();
  const introAnim = useRef(new Animated.Value(0)).current;

  const close = () => {
    Animated.timing(introAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start(() => resetMessage());
  };

  useEffect(() => {
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  }, [introAnim]);

  return (
    <AnimatedView
      style={{
        transform: [
          { translateY: introAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) },
        ],
      }}>
      <Pressable
        onPress={close}
        className={`flex rounded-2xl bg-${colors[level]}-200 border-${colors[level]}-400 border py-4 text-center`}>
        <View className={`flex flex-row items-center justify-center p-2 text-center`}>
          <Text
            className={`mr-3 rounded-full px-2 py-1 text-xs font-bold text-${colors[level]}-900 font-extrabold uppercase`}>
            {level === 'progress' ? appMessage.step + '/' + appMessage.total : level}
          </Text>
          <Text className={`mr-2 font-semibold text-${colors[level]}-900`}>{message}</Text>
          {level === 'progress' && <MonoIcon iconName="Loading" />}
        </View>
      </Pressable>
    </AnimatedView>
  );
};

const colors: Color = {
  error: 'red',
  info: 'blue',
  progress: 'blue',
  success: 'green',
  warning: 'orange',
  empty: '',
};

type Color = {
  [key in AppMessage['level']]: string;
};

export default Snackbar;
