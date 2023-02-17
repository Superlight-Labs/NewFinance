/**
 * @format
 */

import React from 'react';
import 'react-native';
import App from './App';

// Note: test renderer must be required after react-native.
import {render} from '@testing-library/react-native';

it('renders correctly', () => {
  render(<App />);
});
