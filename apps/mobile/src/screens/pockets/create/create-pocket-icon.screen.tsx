import { StackScreenProps } from '@react-navigation/stack';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useCreateBitcoinPocket } from 'hooks/useDeriveBitcoinPocket';
import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';
import { CreatePocketsStackParamList } from './create-pocket-navigation';

type Props = StackScreenProps<CreatePocketsStackParamList, 'CreatePocketIcon'>;

const CreatePocketIconScreen = ({ navigation, route }: Props) => {
  const { type, name } = route.params;

  const [icon, setIcon] = useState<string>('');

  const createBitcoinPocket = useCreateBitcoinPocket(name, () => {});

  const createPocket = (icon: string) => {
    console.log(
      'create Pocket with data - Type: ' + type + ' , Name: ' + name + ' , Icon: ' + icon
    );
    generatePocket(icon);
  };

  const generatePocket = (icon: string) => {
    createBitcoinPocket(() => {}, icon);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-row items-center justify-between px-5 py-5">
        <Pressable onPress={() => navigation.goBack()}>
          <MonoIcon iconName="ArrowLeft" />
        </Pressable>
        <Pressable onPress={() => createPocket(icon)}>
          <Text className="font-manrope text-base font-bold text-[#0AAFFF]">Create Pocket</Text>
        </Pressable>
      </View>
      <View className="mt-32 items-center px-5">
        <Text className="font-manrope text-2xl font-bold">+ New Pocket</Text>
        <Text className="my-3 font-manrope text-xs font-semibold">Individualize your pocket</Text>
        <View className="mt-12 aspect-square h-24 w-24 items-center justify-center rounded-full bg-[#F8F8F8] p-2">
          <TextInputComponent
            style="text-center border-0 text-2xl"
            placeHolder="⚡️"
            value={icon}
            onChangeText={setIcon}
            autoFocus={true}
            autoCapitalize={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreatePocketIconScreen;
