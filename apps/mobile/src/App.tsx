/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import logger from '@superlight/logger';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import React from 'react';
import 'react-native-gesture-handler';
import LoadingScreen from 'screens/loading.screen';
import { RootStackParamList } from 'screens/main-navigation';
import MenuStack from 'screens/menu/menu.stack';
import { useAuthState } from './state/auth.state';
import { useSnackbarState } from './state/snackbar.state';

import Home from 'screens/home.screen';
import OnboardingStack from 'screens/onboarding/onboarding.stack';
import WalletsStack from 'screens/wallets/wallets.stack';
import Welcome from 'screens/welcome.screen';
import { useBip32State } from 'state/bip32.state';
if (__DEV__) {
  import('./../ReactotronConfig').then(() => logger.info('Reactotron Configured'));
}

const Stack = createStackNavigator<RootStackParamList>();
export type RootStack = typeof Stack;

function App(): JSX.Element {
  const { hasHydrated: authHydrated, isAuthenticated } = useAuthState();
  const { message } = useSnackbarState();
  const { hasBip32State, hasHydrated: bipHydrated } = useBip32State();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <>
            {bipHydrated && authHydrated ? (
              <>
                {isAuthenticated ? (
                  <>
                    {hasBip32State && (
                      <>
                        <Stack.Screen name="Home" component={Home} />
                        {WalletsStack({ Stack })}
                      </>
                    )}
                    {OnboardingStack({ Stack })}
                    {MenuStack({ Stack })}
                  </>
                ) : (
                  <Stack.Screen name="Welcome" component={Welcome} />
                )}
              </>
            ) : (
              <Stack.Screen name="Loading" component={LoadingScreen} />
            )}
          </>
        </Stack.Group>
      </Stack.Navigator>
      {message.level !== 'empty' && <Snackbar appMessage={message} />}
    </NavigationContainer>
  );
}

export default App;
