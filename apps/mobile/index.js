/**
 * @format
 */
import './shim.js';

import logger from '@superlight-labs/logger';
import { AppRegistry } from 'react-native';
import Config from 'react-native-config';
import App from './src/App';

global.console = logger;

const appName = {
  name: 'Superlight',
  displayName: 'Superlight',
};

process.env = { ...process.env, ...Config };

AppRegistry.registerComponent(appName.name, () => App);
