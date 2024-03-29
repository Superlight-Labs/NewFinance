/* eslint-disable react-native/no-inline-styles */
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { formatCurrency } from 'utils/format/format';
import { Text, View } from 'utils/wrappers/styled-react-native';
import InteractiveLineChart from '../charts/interactivelinechart.component';

import { useQuery } from '@tanstack/react-query';
import TimePeriodPicker from 'components/shared/picker/time-period-picker.component';
import { DataItem, TimeFrame } from 'src/types/chart';
import { useBitcoinState } from 'state/bitcoin.state';
import { backend, historyApi } from 'utils/superlight-api';

type Props = {
  onChartStart: () => void;
  onChartRelease: () => void;
  isCurrentChartUp: (up: boolean) => void;
};

const BitcoinPreview = ({ onChartStart, onChartRelease, isCurrentChartUp }: Props) => {
  const [currentTimeFrame, setCurrentTimeFrame] = useState<TimeFrame>('weekly');
  const { network } = useBitcoinState();

  const { data: historyData } = useQuery(
    ['historyData', currentTimeFrame],
    () => historyApi.get<DataItem[]>(`/${currentTimeFrame}`).then(res => res.data),
    { retry: false }
  );

  const { data: currentExchangeRate } = useQuery(
    ['exchangeRate'],
    () =>
      backend
        .post<any>('/blockchain/exchange-rate', {
          network,
        })
        .then(res => res.data),
    { retry: false, refetchInterval: 15000 }
  );

  const changeTimeFrame = (timeframe: TimeFrame) => {
    setCurrentTimeFrame(timeframe);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    if (historyData !== undefined && historyData !== currentTimeFrameData) {
      setCurrentTimeFrameData(historyData!);
      isCurrentChartUp(historyData[0].value < historyData[historyData.length - 1].value);
      if (currentExchangeRate !== undefined)
        setselectedDataPoint({ date: '', value: currentExchangeRate.value, time: '' });
    }
  }, [historyData]);

  useEffect(() => {
    if (currentExchangeRate !== undefined) {
      setselectedDataPoint({ date: '', value: currentExchangeRate.value, time: '' });
    }
  }, [currentExchangeRate]);

  const [currentTimeFrameData, setCurrentTimeFrameData] = useState<DataItem[]>([
    {
      date: '01/01/2023',
      value: 30000,
      time: '2013-04-28T00:00:00.000Z',
    },
  ]);

  const [selectedDataPoint, setselectedDataPoint] = useState<DataItem>({
    date: '',
    value: 35000.0,
    time: '2013-04-28T00:00:00.000Z',
  });

  const calcPercentageChange = (start: number, value: number) => {
    return ((value / start) * 100 - 100).toFixed(2);
  };

  const calcAbsoluteChange = (start: number, value: number) => {
    return Math.abs(value - start).toFixed(2);
  };

  const isUp = (selectedDataPointValue: DataItem) => {
    return currentTimeFrameData[0].value < selectedDataPointValue.value;
  };

  const prettifyDate = (timestamp: string) => {
    if (timestamp !== '') {
      const date = new Date(timestamp);
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Monat (0-basiert)
      const day = date.getDate().toString().padStart(2, '0'); // Tag
      const year = date.getFullYear().toString().slice(-2); // Jahr (letzte zwei Ziffern)

      const hours = date.getHours().toString().padStart(2, '0'); // Stunden
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Minuten

      if (currentTimeFrame === 'year' || currentTimeFrame === 'total-graph')
        return `${day}.${month}.${year}`;
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    switch (currentTimeFrame) {
      case 'today': {
        return 'Today';
      }
      case 'weekly': {
        return 'Since 7 days';
      }
      case 'monthly': {
        return 'Since 1 month';
      }
      case 'year': {
        return 'Since 1 year';
      }
      case 'total-graph': {
        return 'Since start';
      }
    }
    return timestamp;
  };

  return (
    <View>
      <View>
        <View className=" px-5">
          {/*<Image
            source={require('../../../../assets/images/icon_bitcoin.png')}
            resizeMode="contain"
            className="mb-2 h-8 w-8"
          />*/}

          <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
            {formatCurrency(selectedDataPoint.value)}
          </Text>

          <View className="flex-row items-center">
            {isUp(selectedDataPoint) ? (
              <MonoIcon
                iconName="ChevronsUp"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#01DC0A'}
              />
            ) : (
              <MonoIcon
                iconName="ChevronsDown"
                width={16}
                height={16}
                strokeWitdth={3}
                color={'#FF3F32'}
              />
            )}

            <Text
              className="font-manrope text-sm font-bold text-[#01DC0A]"
              style={{ color: isUp(selectedDataPoint) ? '#01DC0A' : '#FF3F32' }}>
              {calcAbsoluteChange(currentTimeFrameData[0].value, selectedDataPoint.value)}€ (
              {calcPercentageChange(currentTimeFrameData[0].value, selectedDataPoint.value)}%)
            </Text>
            <MonoIcon iconName="Dot" width={15} height={15} color={'#8E8D95'} />
            <Text className="font-manrope text-sm font-bold text-grey">
              {prettifyDate(selectedDataPoint.time)}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-3">
        <InteractiveLineChart
          data={currentTimeFrameData}
          onValueChange={value => setselectedDataPoint(value)}
          onTouchStart={onChartStart}
          onTouchRelease={() => {
            setselectedDataPoint({ date: '', value: currentExchangeRate.value, time: '' });
            onChartRelease();
          }}
        />

        <TimePeriodPicker onValueChange={value => changeTimeFrame(value)} />
      </View>
    </View>
  );
};

export default BitcoinPreview;
