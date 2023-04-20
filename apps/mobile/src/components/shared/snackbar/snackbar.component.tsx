import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AppMessage, useSnackbarState } from 'state/snackbar.state';
import { AnimatedView, Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import MonoIcon, { FeatherIconName } from '../mono-icon/mono-icon.component';

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
      easing: Easing.elastic(1),
    }).start();
  }, [introAnim]);

  return (
    <AnimatedView
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        transform: [
          { translateY: introAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) },
        ],
      }}>
      <Pressable
        onPress={close}
        className={`flex rounded-2xl bg-${colors[level]}-100 border-${colors[level]}-400 border py-4`}>
        <View className="flex flex-row items-center justify-around p-2 px-8">
          {level === 'progress' ? (
            <Text
              className={`rounded-full px-2 py-1 text-xs font-bold text-${colors[level]}-900 font-extrabold uppercase`}>
              {appMessage.step + '/' + appMessage.total}
            </Text>
          ) : (
            <MonoIcon style="" iconName={icons[level] as FeatherIconName} />
          )}

          <Text className={`font-semibold text-${colors[level]}-900`}>{message}</Text>
          {level === 'progress' ? (
            <MonoIcon iconName="Loading" />
          ) : (
            <MonoIcon style="opacity-0" iconName="Loading" />
          )}
        </View>
      </Pressable>
    </AnimatedView>
  );
};

const icons: Icon = {
  error: 'XCircle',
  info: 'Info',
  progress: 'Info',
  success: 'CheckCircle',
  warning: 'AlertCircle',
  empty: 'AlertCircle',
};

const colors: Color = {
  error: 'superred',
  info: 'superblue',
  progress: 'superblue',
  success: 'supergreen',
  warning: 'orange',
  empty: '',
};

type Color = {
  [key in AppMessage['level']]: string;
};

type Icon = {
  [key in AppMessage['level']]: FeatherIconName;
};

export default Snackbar;
