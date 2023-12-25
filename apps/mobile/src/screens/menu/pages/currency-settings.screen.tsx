import { RadioButtonItem } from 'components/shared/input/radio-button/radio-button';
import RadioButtonGroupComponent from 'components/shared/input/radio-button/radio-button-group.component';
import { useGeneralState } from 'state/general.state';
import { SafeAreaView, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';

export const currencyItems: RadioButtonItem[] = [
  {
    label: 'Bitcoin',
    value: 'BTC',
    disabled: false,
  },
  {
    label: 'Satoshis',
    value: 'sats',
    disabled: false,
  },
  {
    label: 'Euro',
    value: '€',
    disabled: false,
  },
  {
    label: 'US-Dollar',
    value: '$',
    disabled: true,
  },
  {
    label: 'British Pound',
    value: '£',
    disabled: true,
  },
  {
    label: 'Swiss franc',
    value: 'CHF',
    disabled: true,
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
        <Text className="mb-2 mt-2 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Local currency
        </Text>
        <Text className="mb-3 font-manrope text-sm font-medium text-grey">
          Change the displayed currency. It also can be changed by clicking on the currency anywhere
          in the app. {'\n'}
          {'\n'}More available in future versions.
        </Text>
        <ScrollView className="flex h-full pt-6 ">
          <RadioButtonGroupComponent
            items={currencyItems}
            selected={currencyItems.find(item => item.value === currency)}
            onSelectionChange={item => handleSelect(item.value)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CurrencySettings;
