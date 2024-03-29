import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useAuthState } from 'state/auth.state';
import { useSnackbarState } from 'state/snackbar.state';

import {
  AnimatedView,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'utils/wrappers/styled-react-native';

const LoadingWalletMainItem = () => {
  const { setMessage } = useSnackbarState();
  const { user } = useAuthState();

  const notifyLoading = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setMessage({ level: 'info', message: 'Pocket not finished creating...' });
  };

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.ease,
      })
    ).start();
  }, [fadeAnim]);

  return (
    <AnimatedView
      style={{
        opacity: fadeAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 0.5, 0.8],
        }),
      }}>
      <Pressable className={` transition-all `} onPress={notifyLoading}>
        <ImageBackground
          source={require('../../../../assets/images/pockets/pocket_main.png')}
          resizeMode="contain"
          className="h-[240px] w-full">
          <View className="h-full">
            <View className="h-[165px]  justify-end px-5 pb-4 pt-8">
              <Text className="font-manrope text-3xl font-bold text-[#131313]">0,00€</Text>
              <View className="w-full flex-row justify-between">
                <View className="flex-row items-center">
                  <MonoIcon
                    iconName="ChevronsUp"
                    width={16}
                    height={16}
                    strokeWitdth={3}
                    color={'#01DC0A'}
                  />

                  <Text
                    className="font-manrope text-sm font-bold text-[#01DC0A]"
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ color: '#01DC0A' }}>
                    0.00€ ( 0.00 %)
                  </Text>
                </View>
              </View>
            </View>
            <View className="h-[74px] justify-center px-6">
              <Text className="font-manrope text-sm font-semibold text-white">Bitcoin only</Text>
              <Text className="mt-1 font-manrope text-sm font-semibold text-white">
                @{user?.username}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </AnimatedView>
  );
};

export default LoadingWalletMainItem;
