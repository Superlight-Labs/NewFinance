/**
 * @format
 */
import './shim.js';

import { AppRegistry } from 'react-native';
import App from './src/App';

const appName = {
  name: 'NewFinance',
  displayName: 'NewFinance',
};

AppRegistry.registerComponent(appName.name, () => App);
