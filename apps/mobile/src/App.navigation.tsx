import { TransitionPresets } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from 'screens/main-navigation';
import MenuStack from 'screens/menu/menu.stack';
import LoadingScreen from 'screens/shared/loading.screen';
import { useAuthState } from './state/auth.state';
import { useSnackbarState } from './state/snackbar.state';

import Snackbar from 'components/shared/snackbar/snackbar.component';
import Home from 'screens/home.screen';
import OnboardingStack from 'screens/onboarding/onboarding.stack';
import WalletNavigation from 'screens/wallet/wallet.navigation';
import Welcome from 'screens/welcome.screen';
import { useDeriveState } from 'state/derive.state';
const Stack = createStackNavigator<RootStackParamList>();
export type RootStack = typeof Stack;

const AppNavigation = () => {
  const { hasHydrated: authHydrated, isAuthenticated } = useAuthState();
  const { message } = useSnackbarState();
  const { hasHydrated: bipHydrated } = useDeriveState();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'white' } }}>
        <Stack.Group>
          <>
            {bipHydrated && authHydrated ? (
              <>
                {isAuthenticated && (
                  <>
                    <Stack.Screen name="Home" component={Home} />

                    {OnboardingStack({ Stack })}
                    {MenuStack({ Stack })}
                    <Stack.Group
                      screenOptions={{
                        cardStyle: { borderRadius: 32 },
                        presentation: 'modal',
                        gestureEnabled: true,
                        ...TransitionPresets.ModalPresentationIOS,
                      }}>
                      <Stack.Screen name="Wallet" component={WalletNavigation} />
                    </Stack.Group>
                  </>
                )}
                <Stack.Screen name="Welcome" component={Welcome} />
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
