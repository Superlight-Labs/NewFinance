import * as Icon from 'lucide-react-native';
import { styled } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import LoadingIcon from './loading-icon.component';

type Props = {
  iconName: IconName;
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

const getIcon = (name: IconName) => {
  if (name === 'Loading') return LoadingIcon;

  return Icon[name];
};

export default MonoIcon;

export type IconName =
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
  | 'ExternalLink'
  | 'Delete'
  | 'ClipboardCopy'
  | 'ArrowDownCircle'
  | 'Lock'
  | 'UserCheck'
  | 'Heart'
  | 'Search'
  | 'User'
  | 'Github'
  | 'Copy'
  | 'Send'
  | 'Minimize2'
  | 'ChevronDown'
  | 'CheckCircle'
  | 'AtSign'
  | 'Loading'
  | 'ListRestart'
  | 'Wallet';
