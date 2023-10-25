import { Text, View } from 'utils/wrappers/styled-react-native';

const WelcomeSlide3 = () => {
  return (
    <View className="flex w-full flex-col px-4">
      <Text className="font-ibm text-6xl text-white">Make your money saver than ever</Text>
      <Text className="mr-12 mt-6 font-manrope text-lg font-medium text-white">
        Use the technology which institutions use to secure billions of dollars - but completely
        non-custodial.
      </Text>
    </View>
  );
};

export default WelcomeSlide3;
