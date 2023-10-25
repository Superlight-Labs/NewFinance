import { Text, View } from 'utils/wrappers/styled-react-native';

const WelcomeSlide2 = () => {
  return (
    <View className="flex w-full flex-col px-4">
      <Text className="font-ibm text-6xl text-white">Buy and sell Bitcoin with low fees</Text>
      <Text className="mr-12 mt-6 font-manrope text-lg font-medium text-white">
        Build your wealth and start with as little as 1$. Buy by card, bank transfer or Apple Pay*.
      </Text>
    </View>
  );
};

export default WelcomeSlide2;
