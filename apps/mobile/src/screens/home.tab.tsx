/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeTabList } from 'screens/home-navigation';
import { RootStackParamList } from 'src/app-navigation';
import { Text } from 'utils/wrappers/styled-react-native';
import BitcoinStack from './bitcoin/bitcoin.stack';
import MenuStack from './menu/menu.stack';
import PocketsStack from './pockets/pockets.stack';

const Tab = createBottomTabNavigator<HomeTabList>();

type Props = StackScreenProps<RootStackParamList, 'HomeTab'>;

const HomeTabNavigation = ({}: Props) => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 82,
            paddingBottom: 32,
            paddingTop: 6,
            borderTopColor: '#B2B3B4',
            backgroundColor: '#F7F7F7',
          },
          headerShown: false,
        }}
        initialRouteName="Home">
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <Text
                className={`${
                  focused ? 'text-black' : 'text-[#91969D]'
                }  font-manrope-bold text-xs`}>
                Pockets
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <MonoIcon
                color={focused ? '#000000' : '#91969D'}
                height={22}
                width={22}
                strokeWitdth={2.25}
                iconName="Wallet2"
              />
            ),
          }}
          component={PocketsStack}
        />
        <Tab.Screen
          options={{
            tabBarLabelStyle: { fontSize: 8, fontWeight: 'bold' },
            tabBarLabel: ({ focused }) => (
              <Text
                className={`${
                  focused ? 'text-black' : 'text-[#91969D]'
                } font-manrope-bold text-xs`}>
                Bitcoin
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <MonoIcon
                color={focused ? '#000000' : '#91969D'}
                height={22}
                width={22}
                strokeWitdth={2.25}
                iconName="Bitcoin"
              />
            ),
          }}
          name="BitcoinStack"
          component={BitcoinStack}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabelStyle: { fontSize: 8, fontWeight: 'bold' },
            tabBarLabel: ({ focused }) => (
              <Text
                className={`${
                  focused ? 'text-black' : 'text-[#91969D]'
                } font-manrope-bold text-xs`}>
                Profile
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <MonoIcon
                color={focused ? '#000000' : '#91969D'}
                height={22}
                width={22}
                strokeWitdth={2.25}
                iconName="User"
              />
            ),
          }}
          name="MenuStack"
          component={MenuStack}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default HomeTabNavigation;
