import { StackScreenProps } from '@react-navigation/stack';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';
import { CreatePocketsStackParamList } from './create-pocket-navigation';

type Props = StackScreenProps<CreatePocketsStackParamList, 'CreatePocketName'>;

const CreatePocketNameScreen = ({ navigation, route }: Props) => {
  const { type } = route.params;

  const [name, setName] = useState<string>('');

  const nextStep = (nameValue: string) => {
    navigation.navigate('CreatePocketIcon', { type, name: nameValue });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-row items-center justify-between px-5 py-5">
        <Pressable onPress={() => navigation.goBack()}>
          <MonoIcon iconName="ArrowLeft" />
        </Pressable>
        <Pressable onPress={() => nextStep(name)}>
          <Text className="font-manrope text-base font-bold text-[#0AAFFF]">Next</Text>
        </Pressable>
      </View>
      <View className="mt-32 items-center px-5">
        <Text className="font-manrope text-2xl font-bold">+ New Pocket</Text>
        <Text className="my-3 font-manrope text-xs font-semibold">Give your pocket a name</Text>
        <View className="mt-24">
          <TextInputComponent
            style="text-center px-2 border-0 "
            placeHolder="Holiday, Savings ..."
            value={name}
            onChangeText={setName}
            autoFocus={true}
            autoCapitalize={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePocketNameScreen;
