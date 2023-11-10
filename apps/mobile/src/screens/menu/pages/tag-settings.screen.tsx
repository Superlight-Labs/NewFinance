import LayoutComponent from 'components/shared/layout/layout.component';
import { SafeAreaView, ScrollView, Text } from 'utils/wrappers/styled-react-native';

const TagSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <LayoutComponent>
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">NewFinance Tag</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You unique NewFinance tag to send and receive funds.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default TagSettings;
