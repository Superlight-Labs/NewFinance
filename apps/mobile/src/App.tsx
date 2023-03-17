/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import Home from 'screens/home/home.screen';
import Overview from 'screens/wallets/tabs/overview.screen';
import Receive from 'screens/wallets/tabs/receive.screen';
import Send from 'screens/wallets/tabs/send.screen';
import Welcome from 'screens/welcome/welcome.screen';
import { RootStackParamList } from 'util/navigation/main-navigation';
import { WalletScreenList } from 'util/navigation/wallet-navigation';
import { useAuthState } from './state/auth.state';

const Stack = createStackNavigator<RootStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerLeft: () => null,
};

const Tab = createMaterialTopTabNavigator<WalletScreenList>();

function App(): JSX.Element {
  const { isAuthenticated } = useAuthState();

  const defaultScreen = isAuthenticated ? 'Home' : 'Welcome';
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={defaultScreen}
        screenOptions={screenOptions}>
        <Stack.Group screenOptions={{ headerShown: false }}>
          {/* Weird workaround to "fix" react navigation type issues */}
          <Stack.Screen name={'Home' as 'Wallet'} component={Home} />

          <Stack.Screen name="Welcome" component={Welcome} />
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
