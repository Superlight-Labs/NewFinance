import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text } from 'util/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
  disabled?: boolean;
};

const Button = ({ onPress, children, style, disabled = false }: Props) => {
  const bg = disabled ? 'bg-slate-400' : 'bg-slate-800';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-fullp-4 flex flex-row items-center justify-center rounded-full p-4 shadow-lg ${bg} ${style}`}>
      <Text className="font-bold text-white">{children}</Text>
    </Pressable>
  );
};

export default styled(Button);
