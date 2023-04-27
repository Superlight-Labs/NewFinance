import { ReactNode } from 'react';
import { Text } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  style?: string;
};

const Title = ({ children, style }: Props) => {
  return <Text className={`font-manrope-bold text-3xl text-black ${style}`}>{children}</Text>;
};

export default Title;
