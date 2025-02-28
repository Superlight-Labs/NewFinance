/**
 * @format
 */
import './shim.js';

import { registerRootComponent } from 'expo';
import App from './src/App';

const appName = {
  name: 'NewFinance',
  displayName: 'NewFinance',
  version: '1.0.0',
};

registerRootComponent(App);
