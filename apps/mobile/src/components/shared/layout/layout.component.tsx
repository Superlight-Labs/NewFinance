import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { View } from 'util/wrappers/styled-react-native';
import ButtonComponent from '../input/button/button.component';

type Props = {
  children: ReactNode;
  style?: string;
};

const Layout = ({ children, style }: Props) => {
  return (
    <View className={`${style}`}>
      <ButtonComponent
        style="w-32 self-center flex justify-center items-center"
        onPress={() => console.log('hi')}>
        Logout
      </ButtonComponent>

      {children}
    </View>
  );
};

export default styled(Layout);
