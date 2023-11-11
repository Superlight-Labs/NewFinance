import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SetupWallet from 'screens/onboarding/slides/setup-wallet.screen';
import WalletTabsNavigation from 'screens/wallet/wallet.tab';
import { PocketsStackParamList } from './pockets-navigation';
import Pockets from './pockets.screen';

const Stack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator<PocketsStackParamList>();

const PocketsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pockets"
        options={{
          title: 'Balance',
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'system',
            fontWeight: '700',
            fontSize: 32,
          },
        }}>
        {() => (
          <SubStack.Navigator initialRouteName="Pockets" screenOptions={{ headerShown: false }}>
            <SubStack.Screen name="Pockets" component={Pockets} />
            <SubStack.Screen
              name="WalletTab"
              options={{ presentation: 'modal' }}
              component={WalletTabsNavigation}
            />
            <SubStack.Screen name="SetupWallet" component={SetupWallet} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default PocketsStack;
