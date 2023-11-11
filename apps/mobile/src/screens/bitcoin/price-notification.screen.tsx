import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const PriceNotification = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Add price alarm</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          Get notified when the Bitcoin price reaches your set value.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PriceNotification;
