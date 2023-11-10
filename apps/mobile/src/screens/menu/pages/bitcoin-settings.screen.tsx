import { RadioButtonItem } from 'components/shared/input/radio-button/radio-button';
import RadioButtonGroupComponent from 'components/shared/input/radio-button/radio-button-group.component';
import LayoutComponent from 'components/shared/layout/layout.component';
import { useBitcoinState } from 'state/bitcoin.state';
import { SafeAreaView, ScrollView, Text } from 'utils/wrappers/styled-react-native';

const items: RadioButtonItem[] = [
  {
    label: 'Main network',
    text: 'Change to Bitcoin network',
    value: 'main',
    disabled: true,
  },
  {
    label: 'Test network',
    text: 'Change to Bitcoin test network',
    value: 'test',
    disabled: false,
  },
];

const BitcoinSettings = () => {
  const { network, setNetwork } = useBitcoinState();

  const onNetworkChange = (value: string) => {
    setNetwork(value === 'main' ? 'main' : 'test');
  };

  // TODO: instead of true use BitcoinState.hasAddress() as soon as we allow mainnet
  console.log(network);
  return (
    <SafeAreaView className="bg-white">
      <LayoutComponent>
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Network</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          Mainnet will be available in the beta!
        </Text>
        <ScrollView className="flex h-full pt-6 ">
          <RadioButtonGroupComponent
            items={items}
            selected={items.find(item => item.value === network)}
            onSelectionChange={item => onNetworkChange(item.value)}
          />
        </ScrollView>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default BitcoinSettings;
