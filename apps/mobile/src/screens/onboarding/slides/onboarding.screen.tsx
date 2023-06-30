import { StackScreenProps } from '@react-navigation/stack';
import { generateKeyPair } from '@superlight-labs/rn-secure-encryption-module';
import ButtonComponent from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import LayoutComponent from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import { useCreateAuth } from 'hooks/useCreateAuth';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useState } from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import { useAuthState } from 'state/auth.state';
import { constants } from 'utils/constants';
import { Image, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const createProfile = useCreateAuth();
  const { registerUser } = useAuthState();
  const { perform } = useFailableAction();

  const getStarted = useCallback(async () => {
    const newDevicePublicKey = await generateKeyPair(constants.deviceKeyName);

    perform(createProfile(newDevicePublicKey, username, email)).onSuccess(user => {
      registerUser(user);
    });
  }, [navigation, registerUser, createProfile, username, email, perform]);

  const isDisabled = () => {
    if (username.length < 3 || email.length < 3) return true;
    if (username.length > 36 || email.length > 100) return true;

    if (!email.includes('@')) return true;

    return false;
  };

  return (
    <LayoutComponent>
      <ButtonComponent
        disabled={isDisabled()}
        style="absolute right-8 -top-12 rounded-xl"
        onPress={getStarted}>
        Next
      </ButtonComponent>
      <Title>Tell us about yourself</Title>
      <View className="mb-8 mt-12 flex w-full flex-row border-b border-b-slate-200 pb-2">
        <View className="flex-1">
          <Text className="font-inter-medium">Username*</Text>
          <TextInputComponent
            style="border-b-0"
            placeHolder="eg. John Doe"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className=" bottom-1 flex h-12 w-12 items-center justify-center rounded-lg bg-black">
          <MonoIcon color="white" iconName="User" />
        </View>
      </View>
      <View className="flex w-full flex-row border-b border-b-slate-200 pb-2">
        <View className="flex-1">
          <Text className="font-inter-medium">E-mail*</Text>
          <TextInputComponent
            style="border-b-0"
            placeHolder="eg. john.doe@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="bottom-1 flex h-12 w-12 items-center justify-center rounded-lg bg-black p-3">
          <MonoIcon color="white" iconName="AtSign" />
        </View>
      </View>
      <Image
        className="-ml-8 mt-16 h-72 w-screen"
        source={require('../../../../assets/images/lines-1.png')}
      />
    </LayoutComponent>
  );
};

export default OnboardingScreen;
