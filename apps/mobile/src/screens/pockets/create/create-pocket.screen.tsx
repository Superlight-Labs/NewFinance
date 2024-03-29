import ButtonComponent from 'components/shared/input/button/button.component';
import { useCreateBitcoinPocket } from 'hooks/useDeriveBitcoinPocket';
import { SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

const CreatePocket = () => {
  const createBitcoinPocket = useCreateBitcoinPocket(
    (Math.random() + 1).toString(36).substring(7),
    () => {}
  );

  const createPocket = () => {
    console.log('try creating pocket -------');
    createBitcoinPocket(() => {
      console.log('in creating pocket -------');
    });
    console.log('after creating pocket -------');
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Create pocket
        </Text>

        <Text className="mb-3 font-manrope text-sm font-medium text-grey">Add a pocket.</Text>
        <ButtonComponent
          onPress={() => {
            createPocket();
          }}>
          Create pocket
        </ButtonComponent>
      </View>
    </SafeAreaView>
  );
};

export default CreatePocket;
