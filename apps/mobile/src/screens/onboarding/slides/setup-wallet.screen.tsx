import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useGenericSecret } from '@superlight-labs/rn-mpc-client';
import { generateKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useCreateAuth } from 'hooks/useCreateAuth';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useEffect, useState } from 'react';
import { RootStackParamList } from 'src/app-navigation';
import { AppUser, useAuthState } from 'state/auth.state';
import { useDeriveState } from 'state/derive.state';
import { signWithDeviceKeyNoAuth } from 'utils/auth';
import { constants } from 'utils/constants';
import { mnemonicToSeed } from 'utils/wrappers/bip32-neverthrow';
import { Image, Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'SetupWallet'>;

const SetupWallet = ({ navigation, route }: Props) => {
  const [username] = useState(route.params.username);
  const [email] = useState(route.params.email);
  const [withPhrase] = useState(route.params.withPhrase);

  const { derivedUntilLevel, seed } = useDeriveState();

  const [walletName] = useState('Main pocket');
  const [_loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const createProfile = useCreateAuth();
  const { registerUser } = useAuthState();

  const navigator = useNavigation();

  const { perform } = useFailableAction();
  const { generateGenericSecret } = useGenericSecret();
  const { importGenericSecret } = useGenericSecret();
  const { setSecret, setName /*, deleteSeed*/ } = useDeriveState();
  const { user } = useAuthState();
  const [started, setStarted] = useState(false);

  const getStarted = useCallback(async () => {
    console.log('user: ', user);
    if (!user) {
      setLoadingAuth(true);
      const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);
      perform(createProfile(newDevicePublicKey, username, email), () => {
        setLoadingAuth(false);
      }).onSuccess(userData => {
        registerUser(userData);
        setLoadingAuth(false);
        createWallet(userData);
      });
    } else {
      createWallet(user);
    }
  }, [navigation, registerUser, createProfile, username, email, perform, setLoading]);

  const createWallet = (user: AppUser) => {
    setStarted(true);
    if (started) return;

    console.log('should create wallet');
    if (seed) {
      startImportWallet(user);
    } else {
      startGenerateWallet(user);
    }
  };

  //Generate a wallet with a seed phrase by user
  const startImportWallet = (user: AppUser) => {
    // If we have already started, we don't want to start again

    if (!seed || !user || derivedUntilLevel > 1) return;
    console.log('import new wallet');

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
      // Seed will not be deleted for now
      // TODO: Don't save seed in state with launch of mainnet
      //deleteSeed();
      //navigateToHome();
    });
  };

  //Generate a new wallet without a seed phrase in use
  const startGenerateWallet = async (user: AppUser) => {
    console.log('generate new wallet');
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
      console.log('level secret set: ', derivedUntilLevel);
    });
  };

  useEffect(() => {
    if (derivedUntilLevel == 1) navigateToHome();
    //if (derivedUntilLevel >= 2) navigateToHome();
  }, [derivedUntilLevel]);

  const navigateToHome = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView>
      <View className="h-full px-6 pt-3">
        <Pressable
          className="flex w-12 items-start justify-start"
          onPress={() => navigator.goBack()}>
          <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
        </Pressable>
        <View className="flex-1 items-center justify-center">
          <View className="mt-8 flex flex-row items-center">
            <Image
              source={require('../../../../assets/images/logo.png')}
              resizeMode="contain"
              className="mr-2 mt-1 h-4 w-4"
            />
            <Text className="font-manrope text-lg font-semibold text-black">{username}</Text>
          </View>
          <View className="mt-3 flex-row">
            <Text className="font-manrope text-4xl font-semibold">€ 0</Text>
            <Text className="font-manrope text-4xl font-semibold text-[#CECECE]">.00</Text>
            <View className="mb-1.5 ml-2 flex flex-row items-center justify-around">
              <MonoIcon iconName="Loading" height={14} width={14} color="#d3d3da" />
            </View>
          </View>
        </View>
        <View className="mt-32 flex-1 items-center text-center">
          <Text className="font-manrope text-2xl font-semibold">Welcome to NewFinance</Text>
          <Text className="mt-3 text-center font-manrope text-sm font-medium text-[#8E8D95]">
            This is your new and safe way to buy, sell and hold Bitcoin. Finishing creating your
            wallet to hold your Bitcoin with the safest technology.
          </Text>
        </View>
        <View className="pb-4">
          <ButtonComponent iconName="Lock" style="bg-[#0AAFFF]" onPress={() => getStarted()}>
            {withPhrase ? "Let's import your wallet" : "Let's create your safe wallet"}
          </ButtonComponent>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupWallet;
