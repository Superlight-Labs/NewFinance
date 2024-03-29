import { useAuthState } from 'state/auth.state';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const EmailSettings = () => {
  const { user } = useAuthState();

  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Change email
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You have to confirm you new email if you change it.
          {'\n'}
          {'\n'}Changeable in mainnet version.
        </Text>
        <View className="mt-6 items-center justify-center rounded-sm bg-[#F2F1F6] py-3">
          <Text className="font-manrope text-sm font-semibold text-black">{user?.email}</Text>
        </View>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EmailSettings;
