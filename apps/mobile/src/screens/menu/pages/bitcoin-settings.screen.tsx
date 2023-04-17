import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { Switch } from 'react-native';
import { useBitcoinState } from 'state/bitcoin.state.';
import { Text, View } from 'utils/wrappers/styled-react-native';

const BitcoinSettings = () => {
  const { network, setNetwork } = useBitcoinState();

  const onNetworkChange = (value: boolean) => {
    setNetwork(value ? 'main' : 'test');
  };

  return (
    <LayoutComponent noPadding>
      <Title style="ml-8">Bitcoin Settings</Title>
      <View className="mb-4 flex w-full flex-row items-center justify-between border-y-2 border-gray-200 p-4">
        <Text className="text-lg">Use Main-Network</Text>
        <Switch value={network === 'main'} onValueChange={onNetworkChange} />
      </View>
    </LayoutComponent>
  );
};

export default BitcoinSettings;
