/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'utils/wrappers/styled-react-native';
import { MenuStackParamList } from './menu-navigation';
import Menu from './menu.screen';
import InviteFriends from './pages/invite-friends.screen';

const Stack = createNativeStackNavigator<MenuStackParamList>();

const MenuStack = () => {
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
          headerLeft: () => <View />,
        }}
      />
      <Stack.Screen
        name="InviteFriends"
        component={InviteFriends}
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default MenuStack;
