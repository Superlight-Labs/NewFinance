import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { Switch } from 'react-native';
import { useBitcoinConfigState } from 'state/bitcion-config.state';
import { Text, View } from 'util/wrappers/styled-react-native';

const BitcoinSettings = () => {
  const { network, setNetwork } = useBitcoinConfigState();

  const onNetworkChange = (value: boolean) => {
    setNetwork(value ? 'mainnet' : 'testnet');
  };

  return (
    <LayoutComponent noPadding>
      <Title style="ml-8">Bitcoin Settings</Title>
      <View className="mb-4 flex w-full flex-row items-center justify-between border-y-2 border-gray-200 p-4">
        <Text className="text-lg">Use Main-Network</Text>
        <Switch value={network === 'mainnet'} onValueChange={onNetworkChange} />
      </View>
    </LayoutComponent>
  );
};

export default BitcoinSettings;
