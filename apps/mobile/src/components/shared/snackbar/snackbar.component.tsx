import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AppMessage, useSnackbarState } from 'state/snackbar.state';
import { createBugUrl, openWebsite } from 'utils/web-opener';
import { AnimatedView, Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import MonoIcon, { IconName } from '../mono-icon/mono-icon.component';

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 50,
        left: 10,
        right: 10,
        zIndex: 100,
        transform: [
          { translateY: introAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) },
        ],
      }}>
      <Pressable
        onPress={close}
        className={`flex w-full flex-col rounded-2xl bg-${colors[level]}-100 border-2 border-[${font[level]}] border-[${font[level]}] py-4`}>
        <View className="flex flex-row items-center justify-around p-2 px-8">
          {level === 'progress' ? (
            <Text
              className={`rounded-full px-2 py-1 font-manrope-bold text-xs text-[${font[level]}] font-manrope-bold uppercase`}>
              {appMessage.step + '/' + appMessage.total}
            </Text>
          ) : (
            <MonoIcon style="w-16" color={font[level]} iconName={icons[level] as IconName} />
          )}
          <Text className={`text-[${font[level]}]`}>{message}</Text>
          {level === 'progress' ? (
            <MonoIcon iconName="Loading" />
          ) : (
            <MonoIcon style="opacity-0" iconName="Loading" />
          )}
        </View>
        {level === 'error' && (
          <Pressable
            onPress={() => openWebsite(createBugUrl(appMessage.error))}
            className="mt-4 flex flex-row items-center justify-center underline">
            <Text className="mr-2 text-center underline">Report a Bug</Text>
            <MonoIcon iconName="Github" />
          </Pressable>
        )}
      </Pressable>
      <Pressable className="bg-transparent mt-2" onPress={close}>
        <MonoIcon iconName="ChevronDown" />
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
  error: 'red',
  info: 'blue',
  progress: 'blue',
  success: 'green',
  warning: 'orange',
  empty: '',
};

const font: Color = {
  error: '#A33A3A',
  info: '#343E99',
  progress: '#343E99',
  success: '#2B8469',
  warning: '#E8C9A7',
  empty: '',
};

type Color = {
  [key in AppMessage['level']]: string;
};

type Icon = {
  [key in AppMessage['level']]: IconName;
};

export default Snackbar;
