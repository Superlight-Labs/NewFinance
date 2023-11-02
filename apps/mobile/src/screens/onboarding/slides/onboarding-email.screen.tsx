import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { generateKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useCreateAuth } from 'hooks/useCreateAuth';
import { useFailableAction } from 'hooks/useFailable';
import { styled } from 'nativewind';
import { useCallback, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { constants } from 'utils/constants';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'OnboardingEmail'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingEmailScreen = ({ navigation, route }: Props) => {
  const [username] = useState(route.params.username);
  const { withPhrase } = route.params;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigator = useNavigation();

  const createProfile = useCreateAuth();
  const { registerUser } = useAuthState();
  const { perform } = useFailableAction();

  const getStarted = useCallback(async () => {
    setLoading(true);
    Keyboard.dismiss();
    const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);
    perform(createProfile(newDevicePublicKey, username, email), () => {
      setLoading(false);
    }).onSuccess(user => {
      registerUser(user);
      setLoading(false);
    });
  }, [navigation, registerUser, createProfile, username, email, perform, setLoading]);

  const isDisabled = () => {
    if (email.length < 3) return true;
    if (email.length > 100) return true;

    if (!email.includes('@') || email.endsWith('@') || email.endsWith('.') || !email.includes('.'))
      return true;

    return false;
  };

  return (
    <SafeAreaView className="flex h-full justify-between">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex h-full justify-between px-6 pt-3">
        <View>
          <View className="flex-row justify-between">
            <Pressable
              className="flex w-12 items-start justify-start"
              onPress={() => navigator.goBack()}>
              <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
            </Pressable>

            {withPhrase && (
              <View className="rounded-sm  bg-[#F4F5F5] px-5 py-1.5">
                <Text className={'font-manrope text-xs font-semibold text-black'}>
                  Seed phrase in use
                </Text>
              </View>
            )}
          </View>
          <View className="mt-8">
            <Text className="font-manrope text-3xl font-semibold">Email</Text>
            <Text className="mt-4 font-manrope text-xs font-semibold">
              We need this to verify your account.
            </Text>
            <View className="mt-8 flex flex-row border-b border-[#D4D4D5]">
              <TextInputComponent
                style="text-center border-0 "
                placeHolder="Enter your e-mail"
                value={email}
                onChangeText={setEmail}
                autoFocus={true}
              />
            </View>
          </View>
        </View>
        <View className="pb-4">
          <ButtonComponent disabled={isDisabled() || loading} onPress={getStarted}>
            NEXT
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingEmailScreen;
