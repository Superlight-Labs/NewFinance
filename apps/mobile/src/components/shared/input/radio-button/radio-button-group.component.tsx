import { styled } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import { RadioButtonItem } from './radio-button';

type Props = {
  items: RadioButtonItem[];
  style?: string;
  selected?: RadioButtonItem;
  onSelectionChange: (item: RadioButtonItem) => void;
};

const RadioButtonGroup = ({ items, style, onSelectionChange, selected = items[0] }: Props) => {
  const [selectedItem, setSelectedItem] = useState<RadioButtonItem>(selected);

  const handleRadioSelect = (item: RadioButtonItem) => {
    setSelectedItem(item);
    onSelectionChange(item);
  };

  return (
    <View className={` py-3.5   ${style}`}>
      {items.map(item => (
        <RadioButton
          key={item.label}
          item={item}
          selected={selectedItem === item}
          onSelect={itemValue => handleRadioSelect(itemValue)}
        />
      ))}
    </View>
  );
};

type RadioButtonProps = {
  item: RadioButtonItem;
  selected: boolean;
  onSelect: (item: RadioButtonItem) => void;
};

const RadioButton = ({ item, selected, onSelect }: RadioButtonProps) => (
  <Pressable
    disabled={item.disabled}
    onPress={() => onSelect(item)}
    className={`my-4 transition-all active:opacity-70 ${item.disabled ? 'opacity-50' : ''}`}>
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="font-manrope-semibold text-base text-black">{item.label}</Text>
        <Text className="font-manrope text-xs font-bold text-grey">{item.text}</Text>
      </View>
      {!item.disabled && (
        <View className="h-[20] w-[20] items-center justify-center rounded-full border-[0.5px] border-grey  p-[3]">
          {selected && <View className="h-[12] w-[12] rounded-full bg-[#3385FF]" />}
        </View>
      )}
    </View>
  </Pressable>
);

export default styled(RadioButtonGroup);
