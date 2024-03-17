import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { styled } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from 'src/app-navigation';
import { Image, Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingScreen = ({ navigation, route }: Props) => {
  const [username, setUsername] = useState('');
  const { withPhrase } = route.params;

  const navigator = useNavigation();

  const isDisabled = () => {
    if (username.length < 3) return true;
    if (username.length > 36) return true;

    return false;
  };

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
                onChangeText={setUsername}
                autoFocus={true}
              />
            </View>
          </View>
        </View>
        <View className="pb-4">
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

export default OnboardingScreen;
