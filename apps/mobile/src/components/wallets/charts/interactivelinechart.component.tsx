/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
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
  onTouchRelease: () => void;
};

const InteractiveLineChart = ({ data, onValueChange, onTouchRelease }: Props) => {
  const [currentData, setCurrentData] = useState<DataItem[]>(data);
  // Verwende useEffect, um auf Änderungen von data zu reagieren
  useEffect(() => {
    // Hier kannst du auf die neueste Version von data zugreifen
    // und alle notwendigen Aktionen durchführen.
    size.current = data.length;
    setCurrentData(data);
  }, [data]);

  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

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

  let size = useRef(currentData.length);

  let [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = PanResponder.create({
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
      updatePosition(evt.nativeEvent.locationX, currentData);
    },
    onPanResponderMove: (evt, _gestureState) => {
      updatePosition(evt.nativeEvent.locationX, currentData);
    },
    onPanResponderRelease: () => {
      onTouchRelease();
      setPositionX(-1);
    },
  });

  const [prevValue, setPrevValue] = useState(0);
  const [lastExecutionTime, setLastExecutionTime] = useState(0);

  const updatePosition = (x: number, data: DataItem[]) => {
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
    console.log('prevalue: ', prevValue);
    if (prevValue != value) {
      if (Date.now() - lastExecutionTime >= 100) {
        console.log(
          'Date.now() ',
          Date.now(),
          ' - ',
          lastExecutionTime,
          ' ? >= 1000 ',
          Date.now() - lastExecutionTime
        );
        setLastExecutionTime(Date.now());
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        onValueChange(data[value]);
      }
      // Speichere den aktuellen Wert von value als vorherigen Wert um eine Änderungen überprüfen zu können
      setPrevValue(Number(value));

      setPositionX(Number(value));
    }
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
            cy={y(currentData.map(item => item.y)[positionX])}
            r={apx(20 / 3)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#000000"
          />
        </G>
      </G>
    );
  };

  const lowestValueY = (data: DataItem[]) => {
    return data.reduce((min, current) => (current.y < min ? current.y : min), data[0].y);
  };

  const highestValueY = (data: DataItem[]) => {
    return data.reduce((max, current) => (current.y > max ? current.y : max), data[0].y);
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
          height: 380,
          alignSelf: 'stretch',
        }}>
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <LineChart
            style={{
              flex: 1,
              height: 370,
              borderRadius: 10,
              zIndex: 1,
              animationTimingFunction: 'ease',
            }}
            data={currentData.map(item => item.y)}
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
              y1={convertToPercentage(
                currentData[0].y,
                lowestValueY(currentData),
                highestValueY(currentData)
              )}
              x2={'110%'}
              y2={convertToPercentage(
                currentData[0].y,
                lowestValueY(currentData),
                highestValueY(currentData)
              )}
              stroke={'#010001'}
              strokeWidth={2}
              strokeDasharray={'0.3,6'}
              strokeLinecap="round"
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
