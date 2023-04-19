/* eslint-disable react/no-unstable-nested-components */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Receive from 'screens/wallet/tabs/receive.screen';
import Send from 'screens/wallet/tabs/send.screen';
import Wallet from 'screens/wallet/tabs/wallet.screen';
import { WalletTabList } from 'screens/wallet/wallet-navigation';
import { Text } from 'utils/wrappers/styled-react-native';

const Tab = createMaterialTopTabNavigator<WalletTabList>();

const WalletNavigation = () => {
  return (
    <Tab.Navigator tabBarPosition="bottom" initialRouteName="Overview">
      <Tab.Screen
        name="Recieve"
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text className={`${focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'} text-xs font-bold`}>
              Recieve
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#6986F8' : '#8D93A0'} iconName="ArrowDownCircle" />
          ),
        }}
        component={Receive}
      />
      <Tab.Screen
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text className={`${focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'} text-xs font-bold`}>
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#6986F8' : '#8D93A0'} iconName="Heart" />
          ),
        }}
        name="Overview"
        component={Wallet}
      />
      <Tab.Screen
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text className={`${focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'} text-xs font-bold`}>
              Send
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#6986F8' : '#8D93A0'} iconName="Send" />
          ),
        }}
        name="Send"
        component={Send}
      />
    </Tab.Navigator>
  );
};

export default WalletNavigation;
