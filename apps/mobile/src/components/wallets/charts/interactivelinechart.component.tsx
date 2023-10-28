/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
// import * as React from 'react'
import * as Haptics from 'expo-haptics';
import { Dimensions, PanResponder, View } from 'react-native';
import { Circle, G, Line } from 'react-native-svg';
import { LineChart } from 'react-native-svg-charts';

type DataItem = {
  x: string; // x Value of the chart (ex. Date)
  y: number; // y Value of the cart (ex. Price)
};

type Props = {
  data: DataItem[]; // Ein Array von DataItem-Objekten
  onValueChange: (value: DataItem) => void;
};

const InteractiveLineChart = ({ data, onValueChange }: Props) => {
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const [dataList, setDataList] = useState(data);

  //const xValues = data.map(item => item.x);
  const yValues = data.map(item => item.y);

  const convertToPercentage = (value: number, minValue: number, maxValue: number) => {
    // Umrechnung in Prozentwert
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

    // Calculate based on chart hight (380)
    // 340 because 380 - 40 (bottom content inset)
    // 320 because 380 - 40 - 20 (bottom + top content inset)
    return 340 - (320 / 100) * percentage;
  };

  const isUp = (data: DataItem[]) => {
    return data[0].y < data[data.length - 1].y;
  };

  const size = useRef(dataList.length);

  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_evt, _gestureState) => false,

      onStartShouldSetPanResponderCapture: (_evt, _gestureState) => false,
      onMoveShouldSetPanResponder: (_evt, _gestureState) => {
        // Schwellenwerte für horizontalen/vertikalen Unterschied einstellen
        const horizontalThreshold = 7; // Passe dies an
        const verticalThreshold = 10; // Passe dies an

        return (
          Math.abs(_gestureState.dx) > horizontalThreshold &&
          Math.abs(_gestureState.dy) <= verticalThreshold
        );
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Überprüfe, ob die horizontale Bewegung größer ist als die vertikale Bewegung
        // Schwellenwerte für horizontalen/vertikalen Unterschied einstellen
        const horizontalThreshold = 7; // Passe dies an
        const verticalThreshold = 10; // Passe dies an

        return (
          Math.abs(gestureState.dx) > horizontalThreshold &&
          Math.abs(gestureState.dy) <= verticalThreshold
        );
      },
      onPanResponderTerminationRequest: (_evt, _gestureState) => true,

      onPanResponderGrant: (evt, _gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt, _gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    })
  );

  let prevValue = 0;
  let lastExecutionTime = 0;

  const updatePosition = (x: number) => {
    const x0 = apx(0); // x0 position - 0
    const xN = apx(750); //xN position - 414
    const xDistance = xN / (size.current - 1); // The width of each coordinate point
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

    if (prevValue != value) {
      if (Date.now() - lastExecutionTime >= 50) {
        lastExecutionTime = Date.now();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(data[value]);
      }
    }

    // Speichere den aktuellen Wert von value als vorherigen Wert um eine Änderungen überprüfen zu können
    prevValue = Number(value);

    setPositionX(Number(value));
  };

  const Tooltip = ({ x, y, ticks }) => {
    if (positionX < 0) {
      return null;
    }

    return (
      <G x={x(positionX)} key="tooltip">
        <G x={x}>
          <Line y1={ticks[0]} y2={ticks[Number(ticks.length)]} stroke="#9399A1" strokeWidth={0.5} />

          <Circle
            cy={y(yValues[positionX])}
            r={apx(20 / 3)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#000000"
          />
        </G>
      </G>
    );
  };

  const lowestValueY = data.reduce(
    (min, current) => (current.y < min ? current.y : min),
    data[0].y
  );

  const highestValueY = data.reduce(
    (max, current) => (current.y > max ? current.y : max),
    data[0].y
  );

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
          height: 380,
          alignSelf: 'stretch',
        }}>
        <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
          <LineChart
            style={{ flex: 1, height: 370, borderRadius: 10, zIndex: 1 }}
            data={yValues}
            svg={{
              stroke: isUp(dataList) ? '#01DC0A' : '#FD291D',
              strokeWidth: '2px',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
            contentInset={{ top: 20, bottom: 40, right: 12 }}>
            <Line
              x1={0}
              y1={convertToPercentage(dataList[0].y, lowestValueY, highestValueY)}
              x2={'110%'}
              y2={convertToPercentage(dataList[0].y, lowestValueY, highestValueY)}
              stroke={'#010001'}
              strokeWidth={2}
              strokeDasharray={'0.3,6'}
              strokeLinecap="round"
            />
            <Tooltip x={undefined} y={undefined} ticks={undefined} />
          </LineChart>
        </View>
      </View>
    </View>
  );
};

export default InteractiveLineChart;
