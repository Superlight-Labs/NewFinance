import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { RootStackParamList } from 'src/app-navigation';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'PhraseLimitations'>;

const PhraseLimitationsScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <View className="px-5 pt-12">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Security limitations
        </Text>
        <View className="mt-3 flex-row items-center">
          <MonoIcon iconName="Info" width={16} height={16} color="#8E8D95" />
          <Text className="ml-1.5 font-manrope-semibold text-sm text-[#8E8D95]">
            These limitations only affect imported wallets.
          </Text>
        </View>
        <Text className="mt-12 font-manrope-semibold text-sm text-[#8E8D95]">
          Our Multi-Party-Technology keeps your funds save by spliting up the keys and remove single
          points of failure. When creating a new wallet with our app, there is no single timepoint
          where the keys are at one location.
        </Text>
        <Text className="mt-6 font-manrope-semibold text-sm text-[#8E8D95]">
          By importing your recovery phrase, there is already a single point of failure before using
          our app - your recovery phrase.
        </Text>
        <Text className="font-manrope-semibold text-sm text-[#FF000F]">
          When your recovery phrase is compromized, also your full wallet is compromized.{' '}
        </Text>
        <Text className="mt-6 font-manrope-semibold text-sm text-[#0AAFFF]">
          Alternatively create a new wallet and send your funds to it.
        </Text>

        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PhraseLimitationsScreen;
