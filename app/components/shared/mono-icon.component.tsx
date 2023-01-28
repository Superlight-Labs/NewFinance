import {styled} from 'nativewind';
import React from 'react';
import {View} from 'react-native';
import * as Icon from 'react-native-feather';

type Props = {
  iconName: FeatherIconName;
};

const StyledView = styled(View);

const MonoIcon = ({iconName}: Props) => {
  const FeatherIcon = Icon[iconName];

  return (
    <StyledView>
      <FeatherIcon stroke="white" fill="black" />
    </StyledView>
  );
};

export default MonoIcon;

type FeatherIconName = 'ArrowUpCircle' | 'Send';
