import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { styled } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from 'src/app-navigation';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'OnboardingEmail'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingEmailScreen = ({ navigation, route }: Props) => {
  const [username] = useState(route.params.username);
  const { withPhrase } = route.params;

  const [email, setEmail] = useState('');

  const navigator = useNavigation();

  const nextOnboardingStep = () => {
    navigation.navigate('SetupWallet', {
      username: username,
      email: email,
      withPhrase: withPhrase,
    });
  };

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
                onChangeText={setEmail}
                autoFocus={true}
              />
            </View>
          </View>
        </View>
        <View className="px-6 pb-4">
          <ButtonComponent
            style="bg-[#0AAFFF]"
            disabled={isDisabled()}
            onPress={nextOnboardingStep}>
            Next
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingEmailScreen;
