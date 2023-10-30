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
    <View className={`flex-col bg-white ${style} `}>
      <View className="mb-5 mt-2 flex-row px-6">
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

      <View className={` ${noPadding ? '' : ''}`}>{children}</View>
    </View>
  );
};

export default styled(Layout);
