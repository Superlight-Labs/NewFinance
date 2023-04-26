import { styled } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import * as Icon from 'react-native-feather';
import LoadingIcon from './loading-icon.component';

type Props = {
  iconName: FeatherIconName;
  strokeWitdth?: number;
  height?: number;
  width?: number;
  color?: string;
  style?: string;
};

const StyledView = styled(View);

const MonoIcon = ({
  iconName,
  style,
  strokeWitdth = 2,
  height = 24,
  width = 24,
  color = 'black',
}: Props) => {
  const FeatherIcon = getIcon(iconName);

  return (
    <StyledView className={`${style}`}>
      <FeatherIcon color={color} height={height} width={width} strokeWidth={strokeWitdth} />
    </StyledView>
  );
};

const getIcon = (name: FeatherIconName) => {
  if (name === 'Loading') return LoadingIcon;

  return Icon[name];
};

export default MonoIcon;

export type FeatherIconName =
  | 'ArrowUpCircle'
  | 'Send'
  | 'LogOut'
  | 'Camera'
  | 'Settings'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'DollarSign'
  | 'ArrowLeft'
  | 'XCircle'
  | 'UserX'
  | 'Info'
  | 'AlertCircle'
  | 'Clipboard'
  | 'ArrowDownCircle'
  | 'Heart'
  | 'Search'
  | 'User'
  | 'Copy'
  | 'Send'
  | 'Minimize2'
  | 'CheckCircle'
  | 'AtSign'
  | 'Loading';
