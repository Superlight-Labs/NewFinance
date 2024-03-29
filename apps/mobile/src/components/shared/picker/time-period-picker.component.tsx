/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { TimeFrame } from 'src/types/chart';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onValueChange: (value: TimeFrame) => void;
};

const TimePeriodPicker = ({ onValueChange }: Props) => {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('weekly');

  const changeTimeFrame = (timeFrame: TimeFrame) => {
    setCurrentTimeFrame(timeFrame);
    onValueChange(timeFrame);
  };

  return (
    <View className="mt-2 flex-row justify-between px-5">
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'today' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('today')}>
        <Text
          className={`font-manrope text-xs font-bold ${
            currentTimeFrame === 'today' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1T
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'weekly' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('weekly')}>
        <Text
          className={`font-manrope text-xs font-bold ${
            currentTimeFrame === 'weekly' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1W
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'monthly' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('monthly')}>
        <Text
          className={`font-manrope text-xs font-bold ${
            currentTimeFrame === 'monthly' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1M
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'year' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('year')}>
        <Text
          className={`font-manrope text-xs font-bold ${
            currentTimeFrame === 'year' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          1Y
        </Text>
      </Pressable>
      <Pressable
        className="rounded-sm  px-5 py-1.5"
        style={{ backgroundColor: currentTimeFrame === 'total-graph' ? '#F4F5F5' : 'transparent' }}
        onPress={() => changeTimeFrame('total-graph')}>
        <Text
          className={`font-manrope text-xs font-bold ${
            currentTimeFrame === 'total-graph' ? 'text-black' : 'text-[#969EA3]'
          }`}>
          MAX
        </Text>
      </Pressable>
    </View>
  );
};

export default TimePeriodPicker;
