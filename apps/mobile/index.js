/**
 * @format
 */
import './shim.js';

import logger from '@superlight-labs/logger';
import { AppRegistry } from 'react-native';
import App from './src/App';

global.console = logger;

const appName = {
  name: 'Superlight',
  displayName: 'Superlight',
};

AppRegistry.registerComponent(appName.name, () => App);
