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
import { Image, Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingScreen = ({ navigation, route }: Props) => {
  const [isTaken, setIsTaken] = useState(false);
  const [username, setUsername] = useState('');
  const { withPhrase } = route.params;
  const [isManualLoading, setIsManualLoading] = useState(false);

  const navigator = useNavigation();

  const debouncedUsername = useDebounce(username, 500);

  const setAndCheckUsername = (input: string) => {
    const clearedInput = input.replace(/\s/g, '');
    setUsername(clearedInput);
    setIsManualLoading(true); // Setze den manuellen Ladezustand auf true
  };

  const {
    data: takenRes,
    refetch,
    isLoading: queryLoading,
  } = useQuery(
    ['user/istaken', debouncedUsername],
    () => backend.get(`/user/istaken/${debouncedUsername}`).then(res => res.data),
    {
      enabled: false, // Deaktiviert die automatische Ausführung der Abfrage
      retry: false,
      onSettled: () => setIsManualLoading(false),
    }
  );

  useEffect(() => {
    if (debouncedUsername.length >= 3) {
      refetch();
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (takenRes !== undefined) {
      setIsTaken(takenRes);
    }
  }, [takenRes]);

  const isButtonDisabled =
    username.length < 3 || username.length > 36 || isTaken || queryLoading || isManualLoading;

  const nextOnboardingStep = () => {
    navigation.navigate('OnboardingEmail', {
      username: username,
      withPhrase: withPhrase,
    });
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
          </View>
          <View className="mt-8 items-center justify-center text-center">
            <Text className="text-center font-manrope text-2xl font-semibold">
              Choose your username
            </Text>
            <Text className="mt-4 text-center font-manrope text-base font-semibold text-[#8E8D95]">
              This is your unique tag that anyone can send{'\n'}Bitcoin to using NewFinance.
            </Text>
            <View className="mt-8 flex-row items-center">
              <Image
                source={require('../../../../assets/images/logo.png')}
                resizeMode="contain"
                className=" h-4 w-4"
              />
              <TextInputComponent
                containerStyle="flex-none"
                style="text-center px-2 border-b-0 text-3xl"
                placeHolder="username"
                value={username}
                onChangeText={setAndCheckUsername}
                autoFocus={true}
              />
            </View>
            {isTaken && (
              <Text className="mt-2 font-manrope text-xs text-[#FF000F]">
                Username already taken
              </Text>
            )}
          </View>
        </View>
        <View className="pb-4">
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

export default OnboardingScreen;
