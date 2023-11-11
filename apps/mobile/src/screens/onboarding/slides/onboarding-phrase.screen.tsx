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
  const [importOption, setImportOption] = useState<string>('phrase');

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
    <SafeAreaView className="flex h-full justify-between">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex h-full justify-between px-6 pt-3">
        <View>
          <Pressable
            className="flex w-12 items-start justify-start"
            onPress={() => navigation.goBack()}>
            <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
          </Pressable>
          <View className="mt-8">
            <Text className="font-manrope text-3xl font-semibold">Import Wallet</Text>
            <View className="mt-6 flex-row justify-start">
              <Pressable
                className="mr-2  rounded-sm px-5 py-1.5"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ backgroundColor: importOption === 'phrase' ? '#F4F5F5' : 'transparent' }}
                onPress={() => setImportOption('phrase')}>
                <Text
                  className={`font-manrope text-xs font-semibold ${
                    importOption === 'phrase' ? 'text-black' : 'text-[#969EA3]'
                  }`}>
                  Seed phrase
                </Text>
              </Pressable>
            </View>
            <RecoveryPhraseInputComponent setPhrase={setPhrase} />
          </View>
        </View>
        <View className="pb-4">
          <ButtonComponent
            disabled={seedPhrase.split(' ').length !== 12}
            onPress={() => nextOnboardingStep()}>
            NEXT
          </ButtonComponent>
        </View>
      </StyledKeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingPhraseScreen;
