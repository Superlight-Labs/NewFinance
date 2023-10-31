import { TransitionPresets } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import logger from '@superlight-labs/logger';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import Bitcoin from 'screens/bitcoin/bitcoin.component';
import Home from 'screens/home.screen';
import { RootStackParamList } from 'screens/main-navigation';
import MenuStack from 'screens/menu/menu.stack';
import AlphaNoticeScreen from 'screens/onboarding/slides/alpha-notice.screen';
import CreateWallet from 'screens/onboarding/slides/create-wallet.screen';
import ImportWallet from 'screens/onboarding/slides/import-wallet.screen';
import OnboardingEmailScreen from 'screens/onboarding/slides/onboarding-email.screen';
import OnboardingScreen from 'screens/onboarding/slides/onboarding-name.screen';
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
  const {
    hasHydrated: authHydrated,
    isAuthenticated,
    hasKeysSetUp,
    logout,
    login,
  } = useAuthState();
  const { message } = useSnackbarState();
  const { hasHydrated: bipHydrated, derivedUntilLevel } = useDeriveState();
  const appState = useRef(AppState.currentState);
  const [latestAppStateChange, setLatestAppStateChange] = useState<'closed' | 'opened'>('closed');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/background|unknown/) && nextAppState === 'active') {
        setLatestAppStateChange('opened');
      } else if (nextAppState.match(/background|unknown/) && appState.current === 'inactive') {
        setLatestAppStateChange('closed');
      }

      appState.current = nextAppState;
    });

    setLatestAppStateChange('opened');

    return () => {
      subscription.remove();
    };
  }, [authHydrated]);

  const authenticateLocally = useCallback(() => {
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to proceed',
      cancelLabel: 'cancel',
    })
      .then(result => {
        if (result.success) {
          logger.debug({ result }, 'Authenticated');
          login();
        } else {
          logger.error({ result }, 'Error authenticating');
          logout();
        }
      })
      .catch(err => {
        logger.error({ err }, 'Error authenticating');
        logout();
      });
  }, [login, logout]);

  useEffect(() => {
    if (latestAppStateChange === 'closed' && isAuthenticated) {
      logout();
    }

    if (latestAppStateChange === 'opened' && !isAuthenticated && hasKeysSetUp && authHydrated) {
      authenticateLocally();
    }
  }, [
    latestAppStateChange,
    authHydrated,
    isAuthenticated,
    authenticateLocally,
    hasKeysSetUp,
    logout,
  ]);

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
                    {derivedUntilLevel < DerivedUntilLevel.MASTER && (
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
                            cardStyle: {},
                            presentation: 'modal',
                            gestureEnabled: true,
                            ...TransitionPresets.ModalPresentationIOS,
                          }}
                          component={WalletNavigation}
                        />
                        <Stack.Screen name="Bitcoin" component={Bitcoin} />
                        <Stack.Screen
                          name="AlphaNotice"
                          options={{
                            presentation: 'modal',
                            gestureEnabled: false,
                            ...TransitionPresets.ModalPresentationIOS,
                          }}
                          component={AlphaNoticeScreen}
                        />
                      </>
                    ) : (
                      <Stack.Screen name="Loading" component={LoadingScreen} />
                    )}
                    {derivedUntilLevel >= DerivedUntilLevel.MASTER && MenuStack({ Stack })}
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="OnboardingEmail" component={OnboardingEmailScreen} />
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
