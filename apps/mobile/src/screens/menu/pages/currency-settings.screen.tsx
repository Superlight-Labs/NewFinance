/* eslint-disable react-native/no-inline-styles */
import LayoutComponent from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useGeneralState } from 'state/general.state';
import { SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

const CurrencySettings = () => {
  const { setCurrency, currency } = useGeneralState();

  const [selectedValue, setSelectedValue] = useState(currency);

  const handleRadioSelect = (value: Currency) => {
    setSelectedValue(value);
    setCurrency(value);
  };

  return (
    <SafeAreaView>
      <LayoutComponent noPadding={true}>
        <View className="px-6">
          <Title style="mb-8">Choose Currency</Title>
          <View className="mb-4 flex w-full flex-col justify-between space-y-6 ">
            <RadioButton
              label="BTC"
              selected={selectedValue === 'BTC'}
              onSelect={() => handleRadioSelect('BTC')}
            />
            <RadioButton
              label="Satoshis"
              selected={selectedValue === 'sats'}
              onSelect={() => handleRadioSelect('sats')}
            />
            <RadioButton
              label="Euro"
              selected={selectedValue === '€'}
              onSelect={() => handleRadioSelect('€')}
            />
            <RadioButton
              label="Dollar"
              selected={selectedValue === '$'}
              onSelect={() => handleRadioSelect('$')}
            />
            <RadioButton
              label="British Pound"
              selected={selectedValue === '£'}
              onSelect={() => handleRadioSelect('£')}
            />
            <RadioButton
              label="Swiss franc"
              selected={selectedValue === 'CHF'}
              onSelect={() => handleRadioSelect('CHF')}
            />
          </View>
          <View>
            <Text className="font-manrope text-xs font-medium text-[#636360]">
              You can also change the currency displayed by clicking on the text of a currency
              anywhere in the app.{' '}
            </Text>
          </View>
        </View>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default CurrencySettings;

const RadioButton = ({ label, selected, onSelect }) => (
  <TouchableOpacity onPress={onSelect}>
    <View className="w-full flex-row justify-between">
      <Text className="font-manrope-semibold text-base text-black">{label}</Text>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: selected ? '#0AAFFF' : 'gray',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10, // Spacing between text and radio indicator
        }}>
        {selected && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#0AAFFF',
            }}
          />
        )}
      </View>
    </View>
  </TouchableOpacity>
);
