import {render} from '@testing-library/react-native';
import React from 'react';
import MonoIcon from './mono-icon.component';

it('renders correctly', () => {
  render(<MonoIcon iconName="Send" />);
});
