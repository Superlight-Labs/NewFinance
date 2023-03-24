import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { useAuthState } from 'state/auth.state';
import { View } from 'util/wrappers/styled-react-native';
import ButtonComponent from '../input/button/button.component';

type Props = {
  children: ReactNode;
  style?: string;
};

const Layout = ({ children, style }: Props) => {
  const { logout } = useAuthState();

  return (
    <View className={`${style}`}>
      <ButtonComponent style="w-32 self-center flex justify-center items-center" onPress={logout}>
        Logout
      </ButtonComponent>

      {children}
    </View>
  );
};

export default styled(Layout);
