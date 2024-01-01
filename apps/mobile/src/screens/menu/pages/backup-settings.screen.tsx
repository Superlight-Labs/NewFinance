import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const BackupSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="px-5">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Backup
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">Backup your wallet.</Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BackupSettings;
