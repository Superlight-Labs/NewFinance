import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import RecoveryPhraseInputComponent from 'components/wallets/create/recovery-phrase-input.component';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { RootStackParamList } from 'src/app-navigation';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'OnboardingPhrase'>;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const OnboardingPhraseScreen = ({ navigation }: Props) => {
  const [seedPhrase, setPhrase] = useState('');
  const { deleteBip32, derivedUntilLevel, setSeed } = useDeriveState();

  useEffect(() => {
    if (derivedUntilLevel !== DerivedUntilLevel.NONE) {
      deleteBip32();
    }
    console.log('seed phrase length: ' + seedPhrase.split(' ').length);
  }, [seedPhrase]);

  const nextOnboardingStep = () => {
    setSeed(seedPhrase);
    navigation.navigate('Onboarding', {
      withPhrase: true,
    });
  };

  return (
    <SafeAreaView className="flex h-full justify-between bg-white">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex h-full justify-between pt-3">
        <View>
          <View className="flex-row justify-between px-6">
            <Pressable
              className="flex w-12 items-start justify-start"
              onPress={() => navigation.goBack()}>
              <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
            </Pressable>
          </View>

          <View className="mt-8 items-center justify-center text-center">
            <Text className="text-center font-manrope text-2xl font-semibold">
              Enter your recovery phrase
            </Text>
            <Text className="mt-4 px-12 text-center font-manrope text-base font-semibold text-[#8E8D95]">
              Your recovery phrase will be used to import your wallet.
            </Text>
            <View className="mt-8 flex h-14 w-full">
              <RecoveryPhraseInputComponent setPhrase={setPhrase} />
            </View>
            <Pressable onPress={() => navigation.navigate('PhraseLimitations')}>
              <Text className="mt-6 px-12 text-center font-manrope-semibold text-sm text-[#CECECE]">
                By using your own recovery phrase our security mechanics have limitations.
                <Text className="px-12 text-center font-manrope-semibold text-sm text-[#0AAFFF]">
                  {' '}
                  Check out why
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="px-6 pb-4">
          <ButtonComponent
            style="bg-[#0AAFFF]"
            disabled={seedPhrase.split(' ').length !== 12}
            onPress={() => nextOnboardingStep()}>
            Continue
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingPhraseScreen;
