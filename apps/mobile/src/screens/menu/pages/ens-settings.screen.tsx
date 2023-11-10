import LayoutComponent from 'components/shared/layout/layout.component';
import { SafeAreaView, ScrollView, Text } from 'utils/wrappers/styled-react-native';

const ENSSettings = () => {
  return (
    <SafeAreaView className="bg-white">
      <LayoutComponent>
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Bitcoin Name Service</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          You will have an unique bitcoin name to use instead of your address in the next version of
          the app.
        </Text>
        <ScrollView className="flex h-full pt-6 "></ScrollView>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default ENSSettings;
