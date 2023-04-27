import { useAuthState } from 'state/auth.state';
import { Image, View } from 'utils/wrappers/styled-react-native';

const LoadingScreen = () => {
  const { isAuthenticated } = useAuthState();
  return (
    <View className="flex h-screen w-screen items-center justify-center bg-white">
      {!isAuthenticated && (
        <Image className="h-32 w-32" source={require('../../../assets/images/logo.png')} />
      )}
    </View>
  );
};

export default LoadingScreen;
