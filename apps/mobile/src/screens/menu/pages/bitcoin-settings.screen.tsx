import { StackScreenProps } from '@react-navigation/stack';
import { RadioButtonItem } from 'components/shared/input/radio-button/radio-button';
import RadioButtonGroupComponent from 'components/shared/input/radio-button/radio-button-group.component';
import { RootStackParamList } from 'src/app-navigation';
import { useBitcoinState } from 'state/bitcoin.state';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

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

type Props = StackScreenProps<RootStackParamList, 'BitcoinSettings'>;

const BitcoinSettings = ({}: Props) => {
  const { network, setNetwork } = useBitcoinState();

  const onNetworkChange = (value: string) => {
    setNetwork(value === 'main' ? 'main' : 'test');
  };

  // TODO: instead of true use BitcoinState.hasAddress() as soon as we allow mainnet
  console.log(network);
  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Network
        </Text>
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
      </View>
    </SafeAreaView>
  );
};

export default BitcoinSettings;
