/* eslint-disable react-native/no-inline-styles */
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { formatCurrency } from 'utils/format/format';
import { Image, Text, View } from 'utils/wrappers/styled-react-native';
import InteractiveLineChart from '../charts/interactivelinechart.component';

import TimePeriodPicker from 'components/shared/picker/time-period-picker.component';
import { Pressable } from 'react-native';
import { DataItem, TimeFrame } from 'src/types/chart';
import { bitcoinData1Y } from './historical-data/bitcoin-data-1Y';
import { bitcoinDataMax } from './historical-data/bitcoin-data-max';

type Props = {
  onPressHeader?: () => void;
};

const bitcoinData = [
  { timeframe: 'T', data: bitcoinDataMax },
  { timeframe: 'W', data: bitcoinDataMax },
  { timeframe: 'M', data: bitcoinDataMax },
  { timeframe: 'Y', data: bitcoinData1Y },
  { timeframe: 'MAX', data: bitcoinDataMax },
];

const BitcoinPreview = ({ onPressHeader }: Props) => {
  const newData = { x: '', y: 32009.31 };

  const [currentTimeFrameData, setCurrentTimeFrameData] = useState<DataItem[]>(bitcoinData1Y);

  const [currentData, setCurrentData] = useState<DataItem>(newData);

  const calcPercentageChange = (start: number, value: number) => {
    return ((value / start) * 100 - 100).toFixed(2);
  };

  const calcAbsoluteChange = (start: number, value: number) => {
    return (value - start).toFixed(2);
  };

  const isUp = (currentDataValue: DataItem) => {
    return currentTimeFrameData[0].y < currentDataValue.y;
  };

  const prettifyDate = (date: string) => {
    if (date.includes('/')) {
      const dateParts = date.split('/');
      return `${dateParts[1]}.${dateParts[0]}.${dateParts[2].slice(2, 4)}`;
    }
    switch (currentTimeFrame) {
      case 'T': {
        return 'Today';
      }
      case 'W': {
        return 'Since 5 days';
      }
      case 'M': {
        return 'Since 1 month';
      }
      case 'Y': {
        return 'Since 1 year';
      }
      case 'MAX': {
        return 'Since start';
      }
    }
    return date;
  };

  // const pushNewestValue = (value: DataItem) => {
  //Should push newest value change into data Array to update chart
  // };

  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('Y');

  const changeTimeFrame = (timeframe: TimeFrame) => {
    setCurrentTimeFrame(timeframe);
    setCurrentTimeFrameData(bitcoinData.find(item => item.timeframe === timeframe)!.data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pressedHeader = () => {
    if (onPressHeader) onPressHeader();
  };

  return (
    <View>
      <Pressable onPress={() => pressedHeader()}>
        <View className="px-6">
          <Image
            source={require('../../../../assets/images/icon_bitcoin.png')}
            resizeMode="contain"
            className="mb-2 h-8 w-8"
          />

          <View className="flex flex-row items-center justify-between">
            <Title>Bitcoin</Title>
            {onPressHeader && (
              <MonoIcon iconName="ChevronRight" height={17} width={17} color="#91969D" />
            )}
          </View>

          <Text className="font-manrope text-3xl font-bold text-black">
            {formatCurrency(currentData.y)}
          </Text>

          <View className="flex-row items-center">
            {isUp(currentData) ? (
              <MonoIcon iconName="ArrowUp" width={16} height={16} color={'#01DC0A'} />
            ) : (
              <MonoIcon iconName="ArrowDown" width={16} height={16} color={'#FF3F32'} />
            )}

            <Text
              className="font-manrope text-sm font-semibold text-[#01DC0A]"
              style={{ color: isUp(currentData) ? '#01DC0A' : '#FF3F32' }}>
              {calcAbsoluteChange(currentTimeFrameData[0].y, currentData.y)}€ (
              {calcPercentageChange(currentTimeFrameData[0].y, currentData.y)}%)
            </Text>
            <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
            <Text className="font-manrope text-sm font-semibold text-grey">
              {prettifyDate(currentData.x)}
            </Text>
          </View>
        </View>
      </Pressable>
      <View className="mb-32 mt-6">
        <InteractiveLineChart
          data={currentTimeFrameData}
          onValueChange={value => setCurrentData(value)}
          onTouchRelease={() => setCurrentData(newData)}
        />
        <TimePeriodPicker onValueChange={value => changeTimeFrame(value)} />
      </View>
    </View>
  );
};

export default BitcoinPreview;