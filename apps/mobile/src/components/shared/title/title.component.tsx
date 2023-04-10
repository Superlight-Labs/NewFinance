import { ReactNode } from 'react';
import { Text } from 'util/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  style?: string;
};

const Title = ({ children, style }: Props) => {
  return <Text className={`mb-4 text-2xl text-black ${style}`}>{children}</Text>;
};

export default Title;
