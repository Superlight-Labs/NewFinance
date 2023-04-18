import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  shadow?: boolean;
  style?: string;
  disabled?: boolean;
};

const dropStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.5,
  shadowRadius: 14,
};

const Button = ({ onPress, children, style, shadow, disabled = false }: Props) => {
  const bg = disabled ? 'bg-black-600' : 'bg-black';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={shadow && dropStyle}
      className={`rounded-fullp-4 flex flex-row items-center justify-center rounded-full p-4 ${bg} ${style}`}>
      <Text className="font-manrope text-base font-bold text-white">{children}</Text>
    </Pressable>
  );
};

export default styled(Button);
