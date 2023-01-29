/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Welcome from 'screens/welcome/welcome.screen';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Welcome />
    </NavigationContainer>
  );
}

export default App;
