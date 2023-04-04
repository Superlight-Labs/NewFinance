import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text } from 'util/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
};

const Button = ({ onPress, children, style }: Props) => (
  <Pressable
    onPress={onPress}
    className={`flex flex-row items-center justify-center rounded-full bg-slate-800 p-4 shadow-lg ${style}`}>
    <Text className="font-bold text-white">{children}</Text>
  </Pressable>
);

export default styled(Button);
