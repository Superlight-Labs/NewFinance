import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { RootStack } from 'src/App.navigation';
import { MenuStackParamList } from './menu-navigation';
import Menu from './menu.screen';
import BackupSettings from './pages/backup-settings.screen';
import BitcoinSettings from './pages/bitcoin-settings.screen';
import CurrencySettings from './pages/currency-settings.screen';
import EmailSettings from './pages/email-settings.screen';
import ENSSettings from './pages/ens-settings.screen';
import SeedphraseSettings from './pages/seedphrase-settings.screen';
import TagSettings from './pages/tag-settings.screen';

type Props = {
  Stack: RootStack;
};

const SubStack = createStackNavigator<MenuStackParamList>();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
};
const MenuStack = ({ Stack }: Props) => {
  return (
    <Stack.Group>
      <Stack.Screen name="Menu">
        {() => (
          <SubStack.Navigator initialRouteName="MenuList" screenOptions={screenOptions}>
            <SubStack.Screen name="MenuList" component={Menu} />
            <SubStack.Screen name="BitcoinSettings" component={BitcoinSettings} />
            <SubStack.Screen name="CurrencySettings" component={CurrencySettings} />
            <SubStack.Screen name="BackupSettings" component={BackupSettings} />
            <SubStack.Screen name="EmailSettings" component={EmailSettings} />
            <SubStack.Screen name="ENSSettings" component={ENSSettings} />
            <SubStack.Screen name="SeedphraseSettings" component={SeedphraseSettings} />
            <SubStack.Screen name="TagSettings" component={TagSettings} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default MenuStack;
