import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AnimatedView } from 'utils/wrappers/styled-react-native';

type Props = {
  style?: string;
};

const SkeletonBar = ({ style }: Props) => {
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
    <AnimatedView
      className={`h-4 w-24 rounded-full  bg-slate-400 ${style}`}
      style={{
        opacity: fadeAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 0.4, 0.8],
        }),
      }}
    />
  );
};

export default SkeletonBar;
