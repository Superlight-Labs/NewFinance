import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const EmailSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Change email</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You have to confirm you new email if you change it.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EmailSettings;
