import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useDebounce } from 'hooks/useDebounced';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from 'src/app-navigation';
import { backend } from 'utils/superlight-api';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'OnboardingEmail'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingEmailScreen = ({ navigation, route }: Props) => {
  const [isTaken, setIsTaken] = useState(false);
  const [username] = useState(route.params.username);
  const { withPhrase } = route.params;
  const [isManualLoading, setIsManualLoading] = useState(false);

  const [email, setEmail] = useState('');

  const debouncedEmail = useDebounce(email, 500);

  const navigator = useNavigation();

  const setAndCheckEmail = (input: string) => {
    const clearedInput = input.replace(/\s/g, '');
    setEmail(clearedInput);
    setIsManualLoading(true); // Setze den manuellen Ladezustand auf true
  };

  const {
    data: takenRes,
    refetch,
    isLoading: queryLoading,
  } = useQuery(
    ['user/istaken', debouncedEmail],
    () => backend.get(`/user/istaken/${debouncedEmail}`).then(res => res.data),
    {
      enabled: false, // Deaktiviert die automatische Ausführung der Abfrage
      retry: false,
      onSettled: () => setIsManualLoading(false),
    }
  );

  useEffect(() => {
    if (debouncedEmail.length >= 3) {
      refetch();
    }
  }, [debouncedEmail]);

  useEffect(() => {
    if (takenRes !== undefined) {
      setIsTaken(takenRes);
    }
  }, [takenRes]);

  const isButtonDisabled =
    username.length < 3 ||
    username.length > 100 ||
    isTaken ||
    queryLoading ||
    isManualLoading ||
    !email.includes('@') ||
    email.endsWith('@') ||
    email.endsWith('.') ||
    !email.includes('.');

  const nextOnboardingStep = () => {
    navigation.navigate('SetupWallet', {
      username: username,
      email: email,
      withPhrase: withPhrase,
    });
  };

  return (
    <SafeAreaView className="flex h-full justify-between">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex h-full justify-between pt-3">
        <View>
          <View className="flex-row justify-between px-6">
            <Pressable
              className="flex w-12 items-start justify-start"
              onPress={() => navigator.goBack()}>
              <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
            </Pressable>
          </View>

          <View className="mt-8 items-center justify-center text-center">
            <Text className="text-center font-manrope text-2xl font-semibold">
              Enter your E-mail
            </Text>
            <Text className="mt-4 text-center font-manrope text-base font-semibold text-[#8E8D95]">
              We need this to verify you.
            </Text>
            <View className="mt-8 flex-row items-center">
              <TextInputComponent
                containerStyle="flex-none"
                style="text-center border-b-0 text-2xl"
                placeHolder="mail@newfinance.com"
                textContentType={'emailAddress'}
                inputMode="email"
                value={email}
                onChangeText={setAndCheckEmail}
                autoFocus={true}
              />
            </View>
            {isTaken && (
              <Text className="mt-2 font-manrope text-xs text-[#FF000F]">Email already taken</Text>
            )}
          </View>
        </View>
        <View className="px-6 pb-4">
          <ButtonComponent
            style="bg-[#0AAFFF]"
            disabled={isButtonDisabled}
            onPress={nextOnboardingStep}>
            Next
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingEmailScreen;
