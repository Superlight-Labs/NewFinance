import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const SeedphraseSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Seedphrase
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You can export your seedphrase here. But be careful - when exported, our security features
          to not take fully action anymore.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SeedphraseSettings;
