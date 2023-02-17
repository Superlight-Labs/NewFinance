import { Pressable, Text } from 'custom/styled-react-native';
import { styled } from 'nativewind';
import { ReactNode } from 'react';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
};

const Button = ({ onPress, children, style }: Props) => (
  <Pressable
    onPress={onPress}
    className={`${style} rounded-full bg-slate-800 p-4`}>
    <Text className="text-white">{children}</Text>
  </Pressable>
);

export default styled(Button);
