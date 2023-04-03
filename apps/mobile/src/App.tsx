/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import React from 'react';
import 'react-native-gesture-handler';
import reactotron from 'reactotron-react-native';
import Home from 'screens/home.screen';
import { RootStackParamList } from 'screens/main-navigation';
import OnboardingStack from 'screens/onboarding/onboarding.stack';
import WalletsStack from 'screens/wallets/wallets.stack';
import Welcome from 'screens/welcome.screen';
import { useBip32State } from 'state/bip32.state';
import { useAuthState } from './state/auth.state';
import { useSnackbarState } from './state/snackbar.state';

if (__DEV__) {
  const nativeLog = console.log;
  const log = (...args: any) => {
    nativeLog(...args);
    reactotron.display({
      name: `console.log`,
      value: args,
      preview: args.length > 1 ? JSON.stringify(args) : args[0],
    });
  };

  console.log = log;
  import('./../ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const Stack = createStackNavigator<RootStackParamList>();
export type RootStack = typeof Stack;

function App(): JSX.Element {
  const { isAuthenticated } = useAuthState();
  const { message } = useSnackbarState();
  const { hasBip32State } = useBip32State();

  const screenOptions: StackNavigationOptions = {
    headerLeft: () => null,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Group screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              {hasBip32State ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  {WalletsStack({ Stack })}
                </>
              ) : (
                OnboardingStack({ Stack })
              )}
            </>
          ) : (
            <Stack.Screen name="Welcome" component={Welcome} />
          )}
        </Stack.Group>
      </Stack.Navigator>
      {message.level !== 'empty' && <Snackbar appMessage={message} />}
    </NavigationContainer>
  );
}

export default App;
