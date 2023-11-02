import { API_URL } from '@env';
import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useFailableAction } from 'hooks/useFailable';
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { useDeriveState } from 'state/derive.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { mnemonicToSeed } from 'utils/wrappers/bip32-neverthrow';
import { AnimatedView, Image, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'SetupWallet'>;

const SetupWallet = ({ navigation }: Props) => {
  const { derivedUntilLevel, seed } = useDeriveState();

  const [walletName] = useState('Main Wallet');
  const [_loading, setLoading] = useState(false);

  const { perform } = useFailableAction();
  const { generateGenericSecret } = useGenericSecret();
  const { importGenericSecret } = useGenericSecret();
  const { setSecret, setName, deleteSeed } = useDeriveState();
  const { user } = useAuthState();

  useEffect(() => {
    if (seed) {
      startImportWallet();
    } else {
      startGenerateWallet();
    }
  }, []);

  //Generate a wallet with a seed phrase by user
  const startImportWallet = () => {
    if (!seed || !user || derivedUntilLevel > 1) return;

    // Only executed if use decides to use a seed phrase
    // We do this because the `mnemonicToSeed` function is very slow and blocks the UI thread
    setLoading(true);

    const importSecret = mnemonicToSeed(seed).andThen(secret =>
      importGenericSecret(
        {
          baseUrl: API_URL,
          sign: signWithDeviceKeyNoAuth({ userId: user.id, devicePublicKey: user.devicePublicKey }),
        },
        Buffer.from(secret).toString('hex')
      )
    );
    perform(importSecret).onSuccess(result => {
      setLoading(false);
      setName(walletName);
      setSecret({
        peerShareId: result.peerShareId,
        share: result.share,
        path: 'secret',
      });
      deleteSeed();
      navigation.navigate('Home');
    });
  };

  //Generate a new wallet without a seed phrase in use
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
      navigation.navigate('Home');
    });
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
