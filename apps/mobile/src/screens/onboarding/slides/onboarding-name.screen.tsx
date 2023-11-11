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

            {withPhrase && (
              <View className="rounded-sm  bg-[#F4F5F5] px-5 py-1.5">
                <Text className={'font-manrope text-xs font-semibold text-black'}>
                  Seed phrase in use
                </Text>
              </View>
            )}
          </View>
          <View className="mt-6 items-center justify-center text-center">
            <Image
              source={require('../../../../assets/images/bg_onboarding.png')}
              resizeMode="contain"
              className=" h-48 w-1/2"
            />
            <Text className="text-center font-manrope text-3xl font-semibold">
              Say Goodbye to
              {'\n'} legacy finance
            </Text>
            <Text className="mt-8 text-center font-manrope text-xs font-semibold">
              Choose your NewFinance tag
            </Text>
            <View className="mt-8 flex flex-row items-center border-b border-[#D4D4D5]">
              <Image
                source={require('../../../../assets/images/logo.png')}
                resizeMode="contain"
                className=" ml-2 mt-2 h-4 w-4"
              />
              <TextInputComponent
                style="text-center px-2 border-0 "
                placeHolder="@newUser921"
                value={username}
                onChangeText={setUsername}
                autoFocus={true}
              />
            </View>
          </View>
        </View>
        <View className="pb-4">
          <ButtonComponent disabled={isDisabled()} onPress={nextOnboardingStep}>
            NEXT
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
