import { PortalProvider } from '@gorhom/portal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import logger from '@superlight-labs/logger';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import HomeTabNavigation from 'screens/home.tab';
import AlphaNoticeScreen from 'screens/onboarding/slides/alpha-notice.screen';
import OnboardingEmailScreen from 'screens/onboarding/slides/onboarding-email.screen';
import OnboardingScreen from 'screens/onboarding/slides/onboarding-name.screen';
import OnboardingPhraseScreen from 'screens/onboarding/slides/onboarding-phrase.screen';
import PhraseLimitationsScreen from 'screens/onboarding/slides/phrase-limitations.screen';
import SetupWallet from 'screens/onboarding/slides/setup-wallet.screen';
import Welcome from 'screens/onboarding/welcome.screen';
import ComingSoonScreen from 'screens/shared/coming-soon.screen';
import LoadingScreen from 'screens/shared/loading.screen';
import { RootStackParamList } from 'src/app-navigation';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { useAuthState } from './state/auth.state';
import { useSnackbarState } from './state/snackbar.state';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <PortalProvider>
      <NavigationContainer>
        <>
          <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        </>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Group>
            <>
              {bipHydrated && authHydrated ? (
                <>
                  {hasKeysSetUp && derivedUntilLevel >= DerivedUntilLevel.SECRET ? (
                    <>
                      {isAuthenticated ? (
                        <>
                          <Stack.Screen
                            name="HomeTab"
                            component={HomeTabNavigation}
                            options={{
                              headerShown: false,
                              animation: 'fade',
                            }}
                          />
                          <Stack.Screen
                            name="AlphaNotice"
                            options={{ presentation: 'modal' }}
                            component={AlphaNoticeScreen}
                          />
                          <Stack.Screen
                            name="ComingSoon"
                            options={{
                              presentation: 'containedTransparentModal',
                              gestureEnabled: true,
                            }}
                            component={ComingSoonScreen}
                          />
                        </>
                      ) : (
                        <Stack.Screen
                          name="Loading"
                          component={LoadingScreen}
                          options={{
                            animation: 'fade',
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Stack.Screen name="Welcome" component={Welcome} />
                      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                      <Stack.Screen name="OnboardingEmail" component={OnboardingEmailScreen} />
                      <Stack.Screen name="OnboardingPhrase" component={OnboardingPhraseScreen} />
                      <Stack.Screen
                        name="PhraseLimitations"
                        component={PhraseLimitationsScreen}
                        options={{ presentation: 'modal' }}
                      />
                      <Stack.Screen name="SetupWallet" component={SetupWallet} />
                    </>
                  )}
                </>
              ) : (
                <Stack.Screen
                  name="Loading"
                  component={LoadingScreen}
                  options={{
                    animation: 'fade',
                  }}
                />
              )}
            </>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      {message.level !== 'empty' && <Snackbar appMessage={message} />}
    </PortalProvider>
  );
};

export default AppNavigation;
