import { Portal } from '@gorhom/portal';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { AppMessage, useSnackbarState } from 'state/snackbar.state';
import { createBugUrl, openWebsite } from 'utils/web-opener';
import { AnimatedView, Image, Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import MonoIcon from '../mono-icon/mono-icon.component';

type Props = {
  appMessage: AppMessage;
};

const Snackbar = ({ appMessage }: Props) => {
  const { message, level } = appMessage;
  const { resetMessage } = useSnackbarState();
  const introAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      close();
    }, 3000);
  }, []);

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
    <Portal>
      <FullWindowOverlay style={StyleSheet.absoluteFill}>
        <AnimatedView
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 70,
            left: 10,
            right: 10,
            zIndex: 100,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
            transform: [
              { translateY: introAnim.interpolate({ inputRange: [0, 1], outputRange: [-500, 0] }) },
            ],
          }}>
          <Pressable
            onPress={close}
            className={
              ' flex w-full flex-row items-center justify-between rounded border-[1px] border-[] bg-[#262626] px-5 py-3'
            }>
            <View className="flex flex-row items-center">
              <Image
                source={require('../../../../assets/images/coming_soon.png')}
                resizeMode="cover"
                className="mr-3 h-6 w-6"
              />
              {level === 'progress' && (
                <Text
                  className={
                    'font-white rounded-full px-2 py-1 font-manrope-medium text-xs uppercase text-white'
                  }>
                  {appMessage.step + '/' + appMessage.total}
                </Text>
              )}
              <Text className={'mr-3 font-manrope-medium text-sm text-white'}>{message}</Text>
              {level === 'progress' ? (
                <MonoIcon color={'#FFFFFF'} iconName="Loading" />
              ) : (
                <MonoIcon style="opacity-0" iconName="Loading" />
              )}
            </View>
            {level === 'error' && (
              <View className="flex flex-row items-center">
                <Pressable
                  onPress={() => openWebsite(createBugUrl(appMessage.error))}
                  className="flex flex-row items-center justify-center underline">
                  <Text className="mr-2 text-center font-manrope-medium text-sm text-white underline">
                    Report a Bug
                  </Text>
                  <MonoIcon iconName="Github" color={'#FFFFFF'} width={14} />
                </Pressable>
              </View>
            )}
          </Pressable>
        </AnimatedView>
      </FullWindowOverlay>
    </Portal>
  );
};

export default Snackbar;
