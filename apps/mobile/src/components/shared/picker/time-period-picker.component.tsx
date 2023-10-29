/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { TimeFrame } from 'src/types/chart';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onValueChange: (value: TimeFrame) => void;
};

const TimePeriodPicker = ({ onValueChange }: Props) => {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('Y');

  const changeTimeFrame = (timeFrame: TimeFrame) => {
    setCurrentTimeFrame(timeFrame);
    onValueChange(timeFrame);
  };

  return (
    <View className="mt-2 flex-row justify-between px-6">
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'T' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('T')}>
        <Text
          className={`font-manrope text-xs font-semibold ${
            currentTimeFrame === 'T' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1T
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'W' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('W')}>
        <Text
          className={`font-manrope text-xs font-semibold ${
            currentTimeFrame === 'W' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1W
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'M' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('M')}>
        <Text
          className={`font-manrope text-xs font-semibold ${
            currentTimeFrame === 'M' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1M
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'Y' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('Y')}>
        <Text
          className={`font-manrope text-xs font-semibold ${
            currentTimeFrame === 'Y' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1Y
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'MAX' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('MAX')}>
        <Text
          className={`font-manrope text-xs font-semibold ${
            currentTimeFrame === 'MAX' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          MAX
        </Text>
      </Pressable>
    </View>
  );
};

export default TimePeriodPicker;
