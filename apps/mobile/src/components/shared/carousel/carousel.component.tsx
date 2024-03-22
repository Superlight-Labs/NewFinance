import React, { ReactNode, useRef } from 'react';
import { Animated, useWindowDimensions } from 'react-native';
import { AnimatedView, SafeAreaView, ScrollView, View } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode[];
};

const Carousel = ({ children }: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const { width: windowWidth } = useWindowDimensions();

  return (
    <SafeAreaView className="flex w-full flex-col ">
      <View className="">
        <ScrollView
          className="  pt-12"
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={1}>
          {children.map((child, childIndex) => {
            return (
              <View className="w-[100vw]  p-0" key={childIndex}>
                {child}
              </View>
            );
          })}
        </ScrollView>
        <View className="mx-6 mt-3 flex-row">
          {children.map((child, childIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                windowWidth * (childIndex - 1),
                windowWidth * childIndex,
                windowWidth * (childIndex + 1),
              ],
              outputRange: [22, 44, 22],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: [
                windowWidth * (childIndex - 1),
                windowWidth * childIndex,
                windowWidth * (childIndex + 1),
              ],
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            return (
              <AnimatedView
                key={childIndex}
                style={{ width, opacity }}
                className="mx-[3px] my-4 h-[2px] w-4 rounded-full bg-white"
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Carousel;
