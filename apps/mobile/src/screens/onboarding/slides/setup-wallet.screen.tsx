import { API_URL } from '@env';
import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useCreateBitcoinWallet } from 'hooks/useDeriveBitcoinWallet';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useDeriveState } from 'state/derive.state';
import { useSnackbarState } from 'state/snackbar.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { AnimatedView, Image, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'SetupWallet'>;

const SetupWallet = ({ navigation }: Props) => {
  const { user, isAuthenticated } = useAuthState();

  const [walletName] = useState('Main Wallet');
  const [_loading, setLoading] = useState(false);
  const createBitcoinWallet = useCreateBitcoinWallet(() => console.log('success'));

  const { perform } = useFailableAction();
  const { generateGenericSecret } = useGenericSecret();
  const { setSecret, setName } = useDeriveState();

  const { setMessage } = useSnackbarState();

  useEffect(() => {
    startGenerateWallet();
  }, []);

  const startGenerateWallet = () => {
    if (!user) {
      navigation.navigate('Welcome');
      return;
    }

    setLoading(true);

    perform(
      generateGenericSecret({
        baseUrl: API_URL,
        sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
      }),
      () => setLoading(false)
    ).onSuccess(result => {
      setLoading(false);
      setName(walletName);
      setSecret({
        peerShareId: result.peerShareId,
        share: result.share,
        path: 'secret',
      });
      const localSecret = {
        peerShareId: result.peerShareId,
        share: result.share,
        path: 'secret',
      };
      starteCreateFirstWallet(localSecret);
    });
  };

  const starteCreateFirstWallet = (localSecret: any) => {
    createBitcoinWallet(localSecret)(() => {
      finishGenerate();
    });
  };

  const finishGenerate = () => {
    if (!isAuthenticated) {
      setMessage({ message: "You're not authenticated", level: 'warning' });
      return;
    }
    navigation.navigate('Home');
  };

  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 144,
      duration: 15000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <SafeAreaView>
      <View className="h-full items-center justify-center ">
        <Text className="font-manrope text-3xl font-semibold">Welcome</Text>

        <View className="mt-8 flex flex-row items-center">
          <Image
            source={require('../../../../assets/images/logo.png')}
            resizeMode="contain"
            className="mr-1 mt-0.5 h-4 w-4"
          />
          <Text className="text-[#8E8D95]">@{user?.username}</Text>
        </View>
        <View className="mt-96 ">
          <View className="mb-2 flex flex-row items-center justify-center">
            <View className="mr-2 flex flex-row items-center justify-around">
              <MonoIcon iconName="Loading" height={14} width={14} color="#d3d3da" />
            </View>
            <Text className="text-center text-xs text-[#8E8D95]">Creating pocket...</Text>
          </View>
          <View className="h-1.5 w-36 overflow-hidden rounded-full border border-[#d3d3da] ">
            <AnimatedView
              style={{ width: progress }}
              className="h-[100%] rounded-full rounded-r-none bg-[#d3d3da]"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupWallet;
