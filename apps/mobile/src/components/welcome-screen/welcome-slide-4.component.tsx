import { Text, View } from 'utils/wrappers/styled-react-native';

const WelcomeSlide4 = () => {
  return (
    <View className="flex w-full flex-col px-4">
      <Text className="font-ibm text-6xl text-white">Create unlimited pockets</Text>
      <Text className="mr-12 mt-6 font-manrope text-lg font-medium text-white">
        Pockets are like additional accounts. With all the benefits. Organize your money better than
        ever before.
      </Text>
    </View>
  );
};

export default WelcomeSlide4;
