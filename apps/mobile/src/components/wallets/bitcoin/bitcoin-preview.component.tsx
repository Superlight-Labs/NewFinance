/* eslint-disable react-native/no-inline-styles */
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { formatCurrency } from 'utils/format/format';
import { Image, Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import InteractiveLineChart from '../charts/interactivelinechart.component';

import { bitcoinData1Y } from './historical-data/bitcoin-data-1Y';
import { bitcoinDataMax } from './historical-data/bitcoin-data-max';

type Props = {};

type DataItem = {
  x: string; // x Value of the chart (ex. Date)
  y: number; // y Value of the cart (ex. Price)
};

type TimeFrame = 'T' | 'W' | 'M' | 'Y' | 'MAX';

const bitcoinData = [
  { timeframe: 'T', data: bitcoinDataMax },
  { timeframe: 'W', data: bitcoinDataMax },
  { timeframe: 'M', data: bitcoinDataMax },
  { timeframe: 'Y', data: bitcoinData1Y },
  { timeframe: 'MAX', data: bitcoinDataMax },
];

const BitcoinPreview = ({}: Props) => {
  const newData = { x: '', y: 32009.31 };

  const [currentTimeFrameData, setCurrentTimeFrameData] = useState<DataItem[]>(bitcoinData1Y);

  const [currentData, setCurrentData] = useState<DataItem>(newData);

  const calcPercentageChange = (start: number, value: number) => {
    return ((value / start) * 100 - 100).toFixed(2);
  };

  const calcAbsoluteChange = (start: number, value: number) => {
    return (value - start).toFixed(2);
  };

  const isUp = (currentData: DataItem) => {
    return currentTimeFrameData[0].y < currentData.y;
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

  const pushNewestValue = (value: DataItem) => {
    //Should push newest value change into data Array to update chart
  };

  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('Y');

  const changeTimeFrame = (timeframe: TimeFrame) => {
    setCurrentTimeFrame(timeframe);
    setCurrentTimeFrameData(bitcoinData.find(item => item.timeframe === timeframe)!.data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="">
      <View className="px-6">
        <Image
          source={require('../../../../assets/images/icon_bitcoin.png')}
          resizeMode="contain"
          className="mb-2 h-8 w-8"
        />
        <Title>Bitcoin</Title>

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
      <View className="mb-32 mt-6">
        <InteractiveLineChart
          data={currentTimeFrameData}
          onValueChange={value => setCurrentData(value)}
          onTouchRelease={() => setCurrentData(newData)}
        />
        <View className="mt-2 flex-row justify-between px-6">
          <Pressable
            className="rounded-sm  px-5 py-1.5"
            style={{ backgroundColor: currentTimeFrame === 'T' ? '#F4F5F5' : 'transparent' }}
            onPress={() => changeTimeFrame('T')}>
            <Text className="font-manrope text-xs font-semibold text-black">1T</Text>
          </Pressable>
          <Pressable
            className="rounded-sm  px-5 py-1.5"
            style={{ backgroundColor: currentTimeFrame === 'W' ? '#F4F5F5' : 'transparent' }}
            onPress={() => changeTimeFrame('W')}>
            <Text className="font-manrope text-xs font-semibold text-black">1W</Text>
          </Pressable>
          <Pressable
            className="rounded-sm  px-5 py-1.5"
            style={{ backgroundColor: currentTimeFrame === 'M' ? '#F4F5F5' : 'transparent' }}
            onPress={() => changeTimeFrame('M')}>
            <Text className="font-manrope text-xs font-semibold text-black">1M</Text>
          </Pressable>
          <Pressable
            className="rounded-sm  px-5 py-1.5"
            style={{ backgroundColor: currentTimeFrame === 'Y' ? '#F4F5F5' : 'transparent' }}
            onPress={() => changeTimeFrame('Y')}>
            <Text className="font-manrope text-xs font-semibold text-black">1Y</Text>
          </Pressable>
          <Pressable
            className="rounded-sm  px-5 py-1.5"
            style={{ backgroundColor: currentTimeFrame === 'MAX' ? '#F4F5F5' : 'transparent' }}
            onPress={() => changeTimeFrame('MAX')}>
            <Text className="font-manrope text-xs font-semibold text-black">MAX</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BitcoinPreview;
