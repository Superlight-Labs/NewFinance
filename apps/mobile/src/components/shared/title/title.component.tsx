import { ReactNode } from 'react';
import { Text } from 'util/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
};

const Title = ({ children }: Props) => {
  return <Text className="mb-4 text-2xl text-black">{children}</Text>;
};

export default Title;
