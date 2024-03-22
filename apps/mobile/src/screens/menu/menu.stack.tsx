/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable } from 'utils/wrappers/styled-react-native';
import { MenuStackParamList } from './menu-navigation';
import Menu from './menu.screen';
import BackupSettings from './pages/backup-settings.screen';
import BitcoinSettings from './pages/bitcoin-settings.screen';
import CurrencySettings from './pages/currency-settings.screen';
import EmailSettings from './pages/email-settings.screen';
import ENSSettings from './pages/ens-settings.screen';
import InviteFriends from './pages/invite-friends.screen';
import SeedphraseSettings from './pages/seedphrase-settings.screen';
import TagSettings from './pages/tag-settings.screen';

const Stack = createNativeStackNavigator<MenuStackParamList>();

const MenuStack = () => {
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: true,
      }}>
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{
          title: 'Profile',
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'system',
            fontWeight: '700',
            fontSize: 32,
          },
        }}
      />
      <Stack.Screen
        name="InviteFriends"
        component={InviteFriends}
        options={{ headerShown: false, presentation: 'modal' }}
      />
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
      <Stack.Screen name="ENSSettings" options={settingsScreensOptions} component={ENSSettings} />
      <Stack.Screen
        name="SeedphraseSettings"
        options={settingsScreensOptions}
        component={SeedphraseSettings}
      />
      <Stack.Screen name="TagSettings" options={settingsScreensOptions} component={TagSettings} />
    </Stack.Navigator>
  );
};

export default MenuStack;
