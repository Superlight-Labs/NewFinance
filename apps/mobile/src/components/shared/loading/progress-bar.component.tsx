import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AnimatedView, View } from 'utils/wrappers/styled-react-native';

type Props = {
  loadingTime?: number; //in milliseconds
  style?: string;
};

const ProgressBar = ({ loadingTime = 3000, style }: Props) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: loadingTime,
      useNativeDriver: true,
    }).start();
  }, [progressAnim, loadingTime]);

  return (
    <View className={`h-1.5 w-36 overflow-hidden rounded-full border border-[#d3d3da]  ${style}`}>
      <AnimatedView
        style={{
          transform: [
            {
              translateX: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-144, 0],
              }),
            },
          ],
        }}
        className="h-[100%] rounded-full rounded-r-none bg-[#d3d3da]"
      />
    </View>
  );
};

export default ProgressBar;
