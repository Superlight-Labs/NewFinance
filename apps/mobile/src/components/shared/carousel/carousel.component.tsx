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
    <SafeAreaView className="flex w-full flex-1 flex-col items-center justify-center">
      <View className="flex-1 items-center justify-center">
        <ScrollView
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
              <View className="w-[100vw] bg-white p-12" key={childIndex}>
                {child}
              </View>
            );
          })}
        </ScrollView>
        <View className="flex-row items-center justify-center">
          {children.map((child, childIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                windowWidth * (childIndex - 1),
                windowWidth * childIndex,
                windowWidth * (childIndex + 1),
              ],
              outputRange: [16, 32, 16],
              extrapolate: 'clamp',
            });

            return (
              <AnimatedView
                key={childIndex}
                style={{ width }}
                className="mx-1 my-4 h-4 w-4 rounded-full bg-black"
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Carousel;
