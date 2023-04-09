import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import MultilineText from './multiline-text.component';

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  render(<MultilineText value="" />);
});
