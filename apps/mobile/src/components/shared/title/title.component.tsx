import { ReactNode } from 'react';
import { Text } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  style?: string;
};

const Title = ({ children, style }: Props) => {
  return <Text className={`text-black text-2xl font-bold ${style}`}>{children}</Text>;
};

export default Title;
