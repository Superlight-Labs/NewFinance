import MonoIcon, { IconName } from 'components/shared/mono-icon/mono-icon.component';
import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
  textStyle?: string;
  disabled?: boolean;
  iconName: IconName;
  iconColor?: string;
};

const RoundButton = ({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
  iconName,
  iconColor = '#FFFFFF',
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={'items-center justify-center active:opacity-70'}>
      <View className={`h-12 w-12 items-center justify-center rounded-full bg-black p-3 ${style}`}>
        <MonoIcon iconName={iconName} color={iconColor} strokeWitdth={2.3} />
      </View>
      <Text className={`mt-1 font-manrope text-[13px] font-semibold text-black ${textStyle}`}>
        {children}
      </Text>
    </Pressable>
  );
};

export default styled(RoundButton);
