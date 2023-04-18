import { ReactNode } from 'react';
import { Text } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  style?: string;
};

const Title = ({ children, style }: Props) => {
  return (
    <Text className={`text-3xl font-[500] tracking-wider text-black ${style}`}>{children}</Text>
  );
};

export default Title;
