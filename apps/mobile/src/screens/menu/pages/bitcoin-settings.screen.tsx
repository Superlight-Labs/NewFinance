import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { Switch } from 'react-native';
import { useBitcoinState } from 'state/bitcoin.state';
import { Text, View } from 'utils/wrappers/styled-react-native';

const BitcoinSettings = () => {
  const { network, setNetwork } = useBitcoinState();

  const onNetworkChange = (value: boolean) => {
    setNetwork(value ? 'main' : 'test');
  };

  // TODO: instead of true use BitcoinState.hasAddress() as soon as we allow mainnet

  return (
    <LayoutComponent noPadding>
      <Title style="ml-8 mb-8">Bitcoin Settings</Title>
      <View className="mb-4 flex w-full flex-row items-center justify-between border-y-2 border-slate-100 p-4 pl-8">
        <View>
          <Text className="font-inter-medium text-lg">Use Main network</Text>
          <Text className="font-inter text-sm text-slate-400">
            Mainnet will be available in the beta!
          </Text>
        </View>
        <Switch disabled={true} value={network === 'main'} onValueChange={onNetworkChange} />
      </View>
    </LayoutComponent>
  );
};

export default BitcoinSettings;
