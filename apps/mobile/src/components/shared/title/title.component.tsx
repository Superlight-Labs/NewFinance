import { ReactNode } from 'react';
import { Text } from 'util/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  style?: string;
};

const Title = ({ children, style }: Props) => {
  return <Text className={`${style} mb-4 text-2xl text-black`}>{children}</Text>;
};

export default Title;
