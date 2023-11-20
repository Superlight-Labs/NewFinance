import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import logger from '@superlight-labs/logger';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import HomeTabNavigation from 'screens/home.tab';
import BackupSettings from 'screens/menu/pages/backup-settings.screen';
import BitcoinSettings from 'screens/menu/pages/bitcoin-settings.screen';
import CurrencySettings from 'screens/menu/pages/currency-settings.screen';
import EmailSettings from 'screens/menu/pages/email-settings.screen';
import ENSSettings from 'screens/menu/pages/ens-settings.screen';
import SeedphraseSettings from 'screens/menu/pages/seedphrase-settings.screen';
import TagSettings from 'screens/menu/pages/tag-settings.screen';
import AlphaNoticeScreen from 'screens/onboarding/slides/alpha-notice.screen';
import OnboardingEmailScreen from 'screens/onboarding/slides/onboarding-email.screen';
import OnboardingScreen from 'screens/onboarding/slides/onboarding-name.screen';
import OnboardingPhraseScreen from 'screens/onboarding/slides/onboarding-phrase.screen';
import SetupWallet from 'screens/onboarding/slides/setup-wallet.screen';
import Welcome from 'screens/onboarding/welcome.screen';
import LoadingScreen from 'screens/shared/loading.screen';
import { RootStackParamList } from 'src/app-navigation';
import { DerivedUntilLevel, useDeriveState } from 'state/derive.state';
import { Pressable } from 'utils/wrappers/styled-react-native';
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

  const settingsScreensOptions = ({ navigation }: any) => ({
    title: '',
    headerLargeTitle: false,
    headerShadowVisible: false,
    headerShown: true,
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.navigate('Menu');
        }}
        className="ml-0.5">
        <MonoIcon iconName="ArrowLeft" />
      </Pressable>
    ),
  });

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
    <>
      <NavigationContainer>
        <>
          <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        </>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Group>
            <>
              {bipHydrated && authHydrated ? (
                <>
                  {hasKeysSetUp ? (
                    <>
                      <>
                        {isAuthenticated ? (
                          <>
                            {derivedUntilLevel < DerivedUntilLevel.MASTER && (
                              <Stack.Group>
                                <Stack.Screen name="SetupWallet" component={SetupWallet} />
                              </Stack.Group>
                            )}
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
                            <Stack.Group>
                              <Stack.Screen
                                name="BitcoinSettings"
                                options={settingsScreensOptions}
                                component={BitcoinSettings}
                              />
                              <Stack.Screen
                                name="CurrencySettings"
                                options={settingsScreensOptions}
                                component={CurrencySettings}
                              />
                              <Stack.Screen
                                name="BackupSettings"
                                options={settingsScreensOptions}
                                component={BackupSettings}
                              />
                              <Stack.Screen
                                name="EmailSettings"
                                options={settingsScreensOptions}
                                component={EmailSettings}
                              />
                              <Stack.Screen
                                name="ENSSettings"
                                options={settingsScreensOptions}
                                component={ENSSettings}
                              />
                              <Stack.Screen
                                name="SeedphraseSettings"
                                options={settingsScreensOptions}
                                component={SeedphraseSettings}
                              />
                              <Stack.Screen
                                name="TagSettings"
                                options={settingsScreensOptions}
                                component={TagSettings}
                              />
                            </Stack.Group>
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
                    </>
                  ) : (
                    <>
                      <Stack.Screen name="Welcome" component={Welcome} />
                      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                      <Stack.Screen name="OnboardingEmail" component={OnboardingEmailScreen} />
                      <Stack.Screen name="OnboardingPhrase" component={OnboardingPhraseScreen} />
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
    </>
  );
};

export default AppNavigation;
