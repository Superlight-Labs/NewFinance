import { TransitionPresets } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import logger from '@superlight-labs/logger';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import Home from 'screens/home.screen';
import { RootStackParamList } from 'screens/main-navigation';
import MenuStack from 'screens/menu/menu.stack';
import CreateWallet from 'screens/onboarding/slides/create-wallet.screen';
import ImportWallet from 'screens/onboarding/slides/import-wallet.screen';
import OnboardingScreen from 'screens/onboarding/slides/onboarding.screen';
import ReviewCreate from 'screens/onboarding/slides/review-create.screen';
import SetupWallet from 'screens/onboarding/slides/setup-wallet.screen';
import LoadingScreen from 'screens/shared/loading.screen';
import WalletNavigation from 'screens/wallet/wallet.navigation';
import Welcome from 'screens/welcome.screen';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { useAuthState } from './state/auth.state';
import { useSnackbarState } from './state/snackbar.state';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStack = typeof Stack;

const AppNavigation = () => {
  const { hasHydrated: authHydrated, isAuthenticated, hasKeysSetUp } = useAuthState();
  const { message } = useSnackbarState();
  const { hasHydrated: bipHydrated, derivedUntilLevel } = useDeriveState();
  const { login, logout } = useAuthState();
  const appState = useRef(AppState.currentState);
  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      handleActiveChange(nextAppState, hasKeysSetUp, isAuthenticatedRef.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleActiveChange = (nextAppState: AppStateStatus, hasP: boolean, isA: boolean) => {
    if (appState.current.match(/background|inactive/) && nextAppState === 'active') {
      logger.debug('App has come to the foreground!');
      authenticateLocally(hasP, isA);
    } else if (nextAppState.match(/background/) && appState.current.match(/inactive|active/)) {
      isAuthenticatedRef.current = false;
      logger.debug('App has come to the background!');
      logout();
    }

    appState.current = nextAppState;
  };

  const authenticateLocally = (hasP: boolean, isA: boolean) => {
    if (!hasP || isA) {
      return;
    }

    LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to proceed',
      cancelLabel: 'cancel',
    })
      .then(result => {
        if (result.success) {
          isAuthenticatedRef.current = true;
          logger.debug({ result }, 'Authenticated');
          login();
        } else {
          isAuthenticatedRef.current = false;
          logger.error({ result }, 'Error authenticating');
          logout();
        }
      })
      .catch(err => {
        isAuthenticatedRef.current = false;
        logger.error({ err }, 'Error authenticating');
        logout();
      });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'white' } }}>
        <Stack.Group>
          <>
            {bipHydrated && authHydrated ? (
              <>
                {hasKeysSetUp ? (
                  <>
                    {derivedUntilLevel < DerivedUntilLevel.COMPLETE && (
                      <Stack.Group>
                        <Stack.Screen name="SetupWallet" component={SetupWallet} />
                        <Stack.Screen name="Import" component={ImportWallet} />
                        <Stack.Screen name="Create" component={CreateWallet} />
                        <Stack.Screen name="ReviewCreate" component={ReviewCreate} />
                        {MenuStack({ Stack })}
                      </Stack.Group>
                    )}

                    {isAuthenticated ? (
                      <>
                        <Stack.Screen name="Home" component={Home} />

                        <Stack.Screen
                          name="Wallet"
                          options={{
                            cardStyle: { borderRadius: 32 },
                            presentation: 'modal',
                            gestureEnabled: true,
                            ...TransitionPresets.ModalPresentationIOS,
                          }}
                          component={WalletNavigation}
                        />
                        {derivedUntilLevel === DerivedUntilLevel.COMPLETE && MenuStack({ Stack })}
                      </>
                    ) : (
                      <Stack.Screen name="Loading" component={LoadingScreen} />
                    )}
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                  </>
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
};

export default AppNavigation;
