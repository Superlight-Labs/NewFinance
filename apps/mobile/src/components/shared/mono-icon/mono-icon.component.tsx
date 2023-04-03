import { styled } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import * as Icon from 'react-native-feather';

type Props = {
  iconName: FeatherIconName;
  color?: string;
  style?: string;
};

const StyledView = styled(View);

const MonoIcon = ({ iconName, style, color = 'black' }: Props) => {
  const FeatherIcon = Icon[iconName];

  return (
    <StyledView className={`${style}`}>
      <FeatherIcon color={color} />
    </StyledView>
  );
};

export default MonoIcon;

export type FeatherIconName = 'ArrowUpCircle' | 'Send' | 'LogOut' | 'Settings' | 'ChevronLeft';
