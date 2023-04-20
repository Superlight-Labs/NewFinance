import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, View } from 'utils/wrappers/styled-react-native';
import MonoIcon from '../mono-icon/mono-icon.component';

type Props = {
  children: ReactNode;
  hideBack?: boolean;
  noPadding?: boolean;
  style?: string;
  settingsNavigate?: () => void;
};

const Layout = ({
  children,
  hideBack = false,
  noPadding = false,
  style,
  settingsNavigate,
}: Props) => {
  const navigator = useNavigation();
  return (
    <View className={`flex h-full flex-col bg-white pt-12 ${style} `}>
      <View className="my-4 flex flex-row px-8">
        {!hideBack && (
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
