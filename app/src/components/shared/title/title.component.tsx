import {Text} from 'custom/styled-react-native';
import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

const Title = ({children}: Props) => {
  return <Text className="mb-4 text-2xl font-bold">{children}</Text>;
};

export default Title;
