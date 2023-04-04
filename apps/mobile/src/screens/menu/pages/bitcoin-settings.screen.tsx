import { Switch } from 'react-native';
import { useBitcoinConfigState } from 'state/bitcion-config.state';
import { ScrollView, Text, View } from 'util/wrappers/styled-react-native';

const BitcoinSettings = () => {
  const { network, setNetwork } = useBitcoinConfigState();

  const onNetworkChange = (value: boolean) => {
    setNetwork(value ? 'mainnet' : 'testnet');
  };

  return (
    <ScrollView className="flex h-full w-full flex-col ">
      <View className="mb-4 flex w-full flex-row items-center justify-start border-y-2 border-gray-200 p-4">
        <Text className="text-lg">Use Main-Network</Text>
        <Switch value={network === 'mainnet'} onValueChange={onNetworkChange} />
      </View>
    </ScrollView>
  );
};

export default BitcoinSettings;
