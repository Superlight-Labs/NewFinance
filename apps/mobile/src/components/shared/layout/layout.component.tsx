import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, View } from 'util/wrappers/styled-react-native';
import MonoIcon from '../mono-icon/mono-icon.component';

type Props = {
  children: ReactNode;
  rootScreen?: boolean;
  noPadding?: boolean;
  style?: string;
  settingsNavigate?: () => void;
};

const Layout = ({
  children,
  rootScreen = false,
  noPadding = false,
  style,
  settingsNavigate,
}: Props) => {
  const navigator = useNavigation();
  return (
    <View className={`${style} flex flex-col pt-12`}>
      <View className="my-4 flex flex-row px-8">
        {!rootScreen && (
          <Pressable
            className="flex w-12 items-start justify-start"
            onPress={() => navigator.goBack()}>
            <MonoIcon style="flex -ml-0.5" iconName="ArrowLeft" />
          </Pressable>
        )}

        {settingsNavigate && (
          <Pressable
            className="ml-auto flex w-12 items-center justify-center"
            onPress={settingsNavigate}>
            <MonoIcon iconName="Settings" />
          </Pressable>
        )}
      </View>

      <View className={` ${noPadding ? '' : 'p-8'}`}>{children}</View>
    </View>
  );
};

export default styled(Layout);
