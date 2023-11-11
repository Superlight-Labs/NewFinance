import { RadioButtonItem } from 'components/shared/input/radio-button/radio-button';
import RadioButtonGroupComponent from 'components/shared/input/radio-button/radio-button-group.component';
import { useGeneralState } from 'state/general.state';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

const items: RadioButtonItem[] = [
  {
    label: 'Bitcoin',
    value: 'BTC',
  },
  {
    label: 'Satoshis',
    value: 'sats',
  },
  {
    label: 'Euro',
    value: '€',
  },
  {
    label: 'US-Dollar',
    value: '$',
  },
  {
    label: 'British Pound',
    value: '£',
  },
  {
    label: 'Swiss franc',
    value: 'CHF',
  },
];

const CurrencySettings = () => {
  const { setCurrency, currency } = useGeneralState();

  const handleSelect = (value: Currency) => {
    setCurrency(value);
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <Text className="mb-2 mt-2 font-manrope text-4xl font-bold">Local currency</Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          Change the displayed currency. It also can be changed by clicking on the currency anywhere
          in the app.
        </Text>
        <ScrollView className="flex h-full pt-6 ">
          <RadioButtonGroupComponent
            items={items}
            selected={items.find(item => item.value === currency)}
            onSelectionChange={item => handleSelect(item.value)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CurrencySettings;
