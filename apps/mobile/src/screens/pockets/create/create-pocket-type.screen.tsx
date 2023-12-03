import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';
import { CreatePocketsStackParamList } from './create-pocket-navigation';

type Props = StackScreenProps<CreatePocketsStackParamList, 'CreatePocketType'>;

const CreatePocketTypeScreen = ({ navigation }: Props) => {
  const nextStep = (type: string) => {
    navigation.navigate('CreatePocketName', { type });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="mt-32 items-center px-5">
        <Text className="font-manrope text-2xl font-bold">+ New Pocket</Text>
        <Text className="my-3 font-manrope text-xs font-semibold">Choose your pocket type</Text>
        <Pressable
          onPress={() => nextStep('btc')}
          className="mt-8 aspect-square rounded-md bg-[#F8F8F8] px-4 py-5 active:bg-[#F0F0F0]">
          <View className="items-start">
            <View className="items-center justify-center rounded-full bg-[#FFA337] p-1.5">
              <MonoIcon iconName="Bitcoin" color="#FFFFFF" />
            </View>
          </View>
          <View className="mt-12">
            <Text className="font-manrope text-base font-bold">Bitcoin</Text>
            <View className="mt-1 flex-row">
              <Text className="mr-1 font-manrope text-xs font-bold text-[#636360]">
                34.734,83 €
              </Text>
              <Text className="font-manrope text-xs font-bold text-[#01DC0A]">+2.63%</Text>
            </View>
          </View>
        </Pressable>
        <Pressable className="mt-8 flex aspect-square rounded-md bg-[#F8F8F8] px-4 py-5 active:bg-[#F0F0F0]">
          <View className="items-start">
            <View className="items-center justify-center rounded-full bg-[#379FFF] p-1.5">
              <MonoIcon iconName="Euro" color="#FFFFFF" />
            </View>
          </View>
          <View className="mt-12">
            <Text className="font-manrope text-base font-bold">Euro</Text>
            <View className="mt-1 flex-row">
              <Text className="mr-1 font-manrope text-xs font-bold text-[#636360]">1 €</Text>
              <Text className="font-manrope text-xs font-bold text-[#01DC0A]">Stable</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CreatePocketTypeScreen;
