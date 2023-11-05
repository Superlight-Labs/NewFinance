import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { RootStack } from 'src/App';
import { MenuStackParamList } from './menu-navigation';
import Menu from './menu.screen';
import BitcoinSettings from './pages/bitcoin-settings.screen';
import CurrencySettings from './pages/currency-settings.screen';

type Props = {
  Stack: RootStack;
};

const SubStack = createStackNavigator<MenuStackParamList>();

const screenOptions: StackNavigationOptions = { headerShown: false };
const MenuStack = ({ Stack }: Props) => {
  return (
    <Stack.Group>
      <Stack.Screen name="Menu">
        {() => (
          <SubStack.Navigator initialRouteName="MenuList" screenOptions={screenOptions}>
            <SubStack.Screen name="MenuList" component={Menu} />
            <SubStack.Screen name="BitcoinSettings" component={BitcoinSettings} />
            <SubStack.Screen name="CurrencySettings" component={CurrencySettings} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default MenuStack;
