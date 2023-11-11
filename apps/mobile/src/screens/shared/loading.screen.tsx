import logger from '@superlight-labs/logger';
import Button from 'components/shared/input/button/button.component';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback } from 'react';
import { useAuthState } from 'state/auth.state';
import { Image, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

const LoadingScreen = () => {
  const { user } = useAuthState();
  const { logout, login } = useAuthState();

  const authenticateLocally = useCallback(() => {
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to proceed',
      cancelLabel: 'cancel',
    })
      .then(result => {
        if (result.success) {
          logger.debug({ result }, 'Authenticated');
          login();
        } else {
          logger.error({ result }, 'Error authenticating');
          logout();
        }
      })
      .catch(err => {
        logger.error({ err }, 'Error authenticating');
        logout();
      });
  }, [login, logout]);

  return (
    <SafeAreaView className="bg-black">
      <View className="flex h-full justify-between px-4">
        <View className="mt-36 items-center">
          <Text className="font-manrope text-3xl font-bold text-white">Welcome</Text>
          <View className="mt-8 flex flex-row items-center">
            <Image
              source={require('../../../assets/images/logo_white.png')}
              resizeMode="contain"
              className="mr-1 mt-0.5 h-4 w-4"
            />
            <Text className="font-manrope font-bold text-white">@{user?.username}</Text>
          </View>
        </View>
        <View className="mb-6">
          <Button onPress={() => authenticateLocally()}>LOGIN WITH FACE ID</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
