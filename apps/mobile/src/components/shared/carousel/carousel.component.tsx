import { styled } from 'nativewind';
import React, { ReactNode, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

type Props = {
  children: ReactNode[];
};

const StyledAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const Carousel = ({ children }: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const { width: windowWidth } = useWindowDimensions();

  return (
    <StyledAreaView className="flex w-full flex-1 flex-col items-center justify-center">
      <StyledView className="flex-1 items-center justify-center">
        <StyledScrollView
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
              <StyledView className="bg-red w-[100vw]" key={childIndex}>
                {child}
              </StyledView>
            );
          })}
        </StyledScrollView>
        <StyledView className="flex-row items-center justify-center">
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
              <Animated.View
                key={childIndex}
                style={{ width }}
                className="my-4 mx-1 h-4 w-4 rounded-full bg-slate-600"
              />
            );
          })}
        </StyledView>
      </StyledView>
    </StyledAreaView>
  );
};

export default Carousel;
