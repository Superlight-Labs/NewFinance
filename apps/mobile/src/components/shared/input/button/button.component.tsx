import * as Haptics from 'expo-haptics';
import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
  textStyle?: string;
  disabled?: boolean;
  haptic?: boolean;
};

const Button = ({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
  haptic = true,
}: Props) => {
  const bg = disabled ? 'bg-[#606060]' : 'bg-black';

  const pressWithHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  return (
    <Pressable
      disabled={disabled}
      onPress={haptic ? pressWithHaptic : onPress}
      className={`group items-center justify-center rounded px-2 py-3.5 transition-all active:opacity-80 ${bg}  ${style}`}>
      <Text
        className={`group-isolate-active:text-red font-manrope text-sm font-bold text-white ${textStyle}`}>
        {children}
      </Text>
    </Pressable>
  );
};

export default styled(Button);
