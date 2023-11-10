import LayoutComponent from 'components/shared/layout/layout.component';
import { SafeAreaView, ScrollView, Text } from 'utils/wrappers/styled-react-native';

const SeedphraseSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <LayoutComponent>
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Seedphrase</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You can export your seedphrase here. But be careful - when exported, our security features
          to not take fully action anymore.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default SeedphraseSettings;
