import { Text, View } from 'utils/wrappers/styled-react-native';

const WelcomeSlide1 = () => {
  return (
    <View className="flex w-full flex-col px-4">
      <Text className="font-ibm text-6xl text-white">Bitcoin + everything your bank can do</Text>
      <Text className="mr-12 mt-6 font-manrope text-lg font-medium text-white">
        New money that’s save and feels simple. Trully yours and compatible with traditional banks*.
      </Text>
    </View>
  );
};

export default WelcomeSlide1;
