import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const ENSSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Bitcoin Name Service</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You will have an unique bitcoin name to use instead of your address in the next version of
          the app.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ENSSettings;
