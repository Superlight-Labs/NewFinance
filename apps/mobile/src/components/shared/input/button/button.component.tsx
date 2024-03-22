import MonoIcon, { IconName } from 'components/shared/mono-icon/mono-icon.component';
import * as Haptics from 'expo-haptics';
import { styled } from 'nativewind';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
  textStyle?: string;
  disabled?: boolean;
  haptic?: boolean;
  iconName?: IconName;
};

const Button = ({
  onPress,
  children,
  style,
  textStyle,
  iconName,
  disabled = false,
  haptic = true,
}: Props) => {
  const bg = disabled ? 'opacity-50' : 'opacity-100';

  const pressWithHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={haptic ? pressWithHaptic : onPress}
      className={`group flex-row items-center  rounded px-2 py-3.5 transition-all active:opacity-70 ${
        iconName ? 'justify-between' : 'justify-center'
      } ${bg}  ${style}`}>
      <View
        className={`group flex-row items-center ${
          iconName ? 'justify-between' : 'justify-center'
        } `}>
        {iconName && (
          <View className="flex-row items-center">
            <View className="mr-2 aspect-square items-center justify-center rounded-full bg-[#FFFFFF33] p-1.5">
              <MonoIcon iconName={iconName} color="white" strokeWitdth={2.5} width={14} />
            </View>
            <Text
              className={`group-isolate-active:text-red font-manrope text-base font-bold text-white ${textStyle}`}>
              {children}
            </Text>
          </View>
        )}
        {!iconName && (
          <Text
            className={`group-isolate-active:text-red font-manrope text-base font-bold text-white ${textStyle}`}>
            {children}
          </Text>
        )}
        {iconName && (
          <View className="aspect-square items-center justify-center p-1.5">
            <MonoIcon iconName={'ArrowRight'} color="white" strokeWitdth={2.5} width={18} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default styled(Button);
