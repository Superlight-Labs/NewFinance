import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  strokeWitdth?: number;
  height?: number;
  width?: number;
  color?: string;
};

const LoadingIcon = ({ strokeWitdth = 2, height = 24, width = 24, color = 'black' }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        transform: [
          { rotate: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
        ],
      }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWitdth}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
      </Svg>
    </Animated.View>
  );
};

export default LoadingIcon;
