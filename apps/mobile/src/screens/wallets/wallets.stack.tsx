import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import Receive from 'screens/wallets/tabs/receive.screen';
import Send from 'screens/wallets/tabs/send.screen';
import { WalletScreenList } from 'screens/wallets/wallet-navigation';
import Wallets from 'screens/wallets/wallets.screen';
import { RootStack } from 'src/App';

type Props = {
  Stack: RootStack;
};

const Tab = createMaterialTopTabNavigator<WalletScreenList>();

const WalletsStack = ({ Stack }: Props) => {
  const screenOptions: StackNavigationOptions = {
    headerLeft: () => null,
  };

  return (
    <Stack.Group
      screenOptions={{
        presentation: 'modal',
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}>
      <Stack.Screen name="Wallets">
        {() => (
          <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={screenOptions}
            initialRouteName="Overview">
            <Tab.Screen name="Recieve" component={Receive} />
            <Tab.Screen name="Overview" component={Wallets} />
            <Tab.Screen name="Send" component={Send} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default WalletsStack;
