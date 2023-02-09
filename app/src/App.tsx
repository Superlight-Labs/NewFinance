/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import Home from 'screens/home/home.screen';
import Overview from 'screens/wallets/tabs/overview.screen';
import Receive from 'screens/wallets/tabs/receive.screen';
import Send from 'screens/wallets/tabs/send.screen';
import Welcome from 'screens/welcome/welcome.screen';
import {RootStackParamList} from './navigation/main-navigation';
import {WalletScreenList} from './navigation/wallet-navigation';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerLeft: () => null,
};

const Tab = createMaterialTopTabNavigator<WalletScreenList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Group>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Group>

        <Stack.Group
          screenOptions={{
            presentation: 'modal',
            gestureEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}>
          <Stack.Screen name="Wallet">
            {() => (
              <Tab.Navigator
                tabBarPosition="bottom"
                screenOptions={screenOptions}
                initialRouteName="Overview">
                <Tab.Screen name="Recieve" component={Receive} />
                <Tab.Screen name="Overview" component={Overview} />
                <Tab.Screen name="Send" component={Send} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
