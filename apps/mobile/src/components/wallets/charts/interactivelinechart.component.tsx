/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import { LineChart } from '@superlight-labs/rn-svg-charts';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, View } from 'react-native';
import { Circle, G, Line } from 'react-native-svg';
import { DataItem } from 'src/types/chart';

type Props = {
  data: DataItem[]; // Ein Array von DataItem-Objekten
  onValueChange: (value: DataItem) => void;
  onTouchStart: () => void;
  onTouchRelease: () => void;
  height?: number;
};

type TooltipProps = {
  x: any;
  y: any;
  ticks: any;
};

const InteractiveLineChart = ({
  data,
  onValueChange,
  onTouchStart,
  onTouchRelease,
  height = 380,
}: Props) => {
  const [currentData, setCurrentData] = useState<DataItem[]>(data);
  const [prevValue, setPrevValue] = useState(0);
  const [lastExecutionTime, setLastExecutionTime] = useState(0);
  let size = useRef(currentData.length);
  let [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  //update size for tooltip and data
  useEffect(() => {
    size.current = data.length;
    setCurrentData(data);
  }, [data]);

  const apx = (sizeValue = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * sizeValue;
  };

  const isUp = (dataValue: DataItem[]) => {
    return dataValue[0].value < dataValue[dataValue.length - 1].value;
  };

  //calc lowest y value of data
  const lowestValueY = (dataValue: DataItem[]) => {
    return dataValue.reduce(
      (min, current) => (current.value < min ? current.value : min),
      dataValue[0].value
    );
  };

  //calc highest y value of data
  const highestValueY = (dataValue: DataItem[]) => {
    return dataValue.reduce(
      (max, current) => (current.value > max ? current.value : max),
      dataValue[0].value
    );
  };

  //calc Y Position of horizontal Line
  const calcYLinePosition = (dataValue: DataItem[]) => {
    const percentage =
      ((dataValue[0].value - lowestValueY(dataValue)) /
        (highestValueY(dataValue) - lowestValueY(dataValue))) *
      100;

    // Calculate based on chart hight (380)
    // 340 because 380 - 40 (bottom content inset)
    // 320 because 380 - 40 - 20 (bottom + top content inset)
    return height - 40 - ((height - 60) / 100) * percentage;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_evt, _gestureState) => false,
    onStartShouldSetPanResponderCapture: (_evt, _gestureState) => false,
    onMoveShouldSetPanResponder: (_evt, _gestureState) => {
      // Schwellenwerte für horizontalen/vertikalen Unterschied einstellen
      const horizontalThreshold = 7;
      const verticalThreshold = 40;
      return (
        Math.abs(_gestureState.dx) > horizontalThreshold &&
        Math.abs(_gestureState.dy) <= verticalThreshold
      );
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      // Überprüfe, ob die horizontale Bewegung größer ist als die vertikale Bewegung
      // Schwellenwerte für horizontalen/vertikalen Unterschied einstellen
      const horizontalThreshold = 7;
      const verticalThreshold = 40;
      return (
        Math.abs(gestureState.dx) > horizontalThreshold &&
        Math.abs(gestureState.dy) <= verticalThreshold
      );
    },
    onPanResponderGrant: (evt, _gestureState) => {
      updatePosition(evt.nativeEvent.locationX, currentData);
    },
    onPanResponderMove: (evt, _gestureState) => {
      onTouchStart();
      updatePosition(evt.nativeEvent.locationX, currentData);
    },
    onPanResponderRelease: () => {
      onTouchRelease();
      setPositionX(-1);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => {
      // Hier können Sie entscheiden, ob der PanResponder beendet werden soll
      // Beispiel: verhindern Sie die Beendigung, wenn die Geste vertikal ist
      return Math.abs(gestureState.dy) > 10;
    },
  });

  const updatePosition = (x: number, dataValue: DataItem[]) => {
    const x0 = apx(0); // x0 position - 0
    const xN = apx(750); //xN position - 414
    const xDistance = xN / size.current; // The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    let value = Number(((x - x0) / xDistance).toFixed(0));
    if (value >= size.current - 1) {
      value = size.current - 1; // Out of chart range, automatic correction
    }
    if (prevValue !== value) {
      onValueChange(dataValue[value]);
      if (Date.now() - lastExecutionTime >= 100) {
        setLastExecutionTime(Date.now());
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // Speichere den aktuellen Wert von value als vorherigen Wert um eine Änderungen überprüfen zu können
      setPrevValue(Number(value));
      setPositionX(Number(value)); // Change position of tooltip
    }
  };

  const Tooltip = ({ x, y, ticks }: TooltipProps) => {
    if (positionX < 0) {
      return null;
    }
    return (
      <G x={x(positionX)} key="tooltip">
        <G x={x}>
          <Line y1={ticks[0]} y2={ticks[Number(ticks.length)]} stroke="#9399A1" strokeWidth={0.5} />

          <Circle
            cy={y(currentData.map(item => item.value)[positionX])}
            r={apx(20 / 3)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#000000"
          />
        </G>
      </G>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        alignItems: 'stretch',
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: apx(750),
          height: height,
          alignSelf: 'stretch',
        }}>
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <LineChart
            style={{
              flex: 1,
              height: height,
              borderRadius: 10,
              zIndex: 1,
            }}
            data={currentData.map(item => item.value)}
            svg={{
              stroke: isUp(currentData) ? '#01DC0A' : '#FD291D',
              strokeWidth: '2px',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
            contentInset={{ top: 20, bottom: 40, right: 12 }}
            animate={true}
            animationDuration={1000}>
            <Line
              x1={0}
              y1={calcYLinePosition(currentData)}
              x2={'110%'}
              y2={calcYLinePosition(currentData)}
              stroke={'#010001'}
              strokeWidth={2}
              strokeDasharray={'0.3,6'}
              strokeLinecap="round"
              // @ts-ignore
              belowChart={true}
            />
            <Tooltip x={undefined} y={undefined} ticks={undefined} />
          </LineChart>
        </View>
      </View>
    </View>
  );
};

export default InteractiveLineChart;
