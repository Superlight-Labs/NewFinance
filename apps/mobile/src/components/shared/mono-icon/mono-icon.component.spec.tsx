import {render} from '@testing-library/react-native';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import React from 'react';

it('renders correctly', () => {
  render(<MonoIcon iconName="Send" />);
});
