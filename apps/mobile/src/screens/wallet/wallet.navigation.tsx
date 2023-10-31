/* eslint-disable react/no-unstable-nested-components */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import React from 'react';
import { RootStackParamList } from 'screens/main-navigation';
import Receive from 'screens/wallet/tabs/receive.screen';
import Send from 'screens/wallet/tabs/send.screen';
import Wallet from 'screens/wallet/tabs/wallet.screen';
import { WalletTabList } from 'screens/wallet/wallet-navigation';
import { useBitcoinState } from 'state/bitcoin.state';
import { Text } from 'utils/wrappers/styled-react-native';

const Tab = createMaterialTopTabNavigator<WalletTabList>();

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

const WalletNavigation = ({ route }: Props) => {
  const { getAccountAddresses } = useBitcoinState();
  const { account } = route.params;

  const addresses = getAccountAddresses(account);
  const { external } = addresses;

  return (
    <Tab.Navigator
      screenOptions={{ tabBarStyle: { paddingBottom: 24 }, tabBarIndicator: () => null }}
      tabBarPosition="bottom"
      initialRouteName="Overview">
      <Tab.Screen
        name="Recieve"
        initialParams={{ external }}
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? 'text-[#1B1C21]' : 'text-[#CBCCCD]'
              } pt-1 font-manrope-bold text-xs`}>
              Receive
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#1B1C21' : '#CBCCCD'} iconName="ArrowDownToDot" />
          ),
        }}
        component={Receive}
      />
      <Tab.Screen
        initialParams={{ account, addresses }}
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? 'text-[#1B1C21]' : 'text-[#CBCCCD]'
              } pt-1 font-manrope-bold text-xs`}>
              Pocket
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#1B1C21' : '#CBCCCD'} iconName="Wallet2" />
          ),
        }}
        name="Overview"
        component={Wallet}
      />
      <Tab.Screen
        initialParams={{ external }}
        options={{
          tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused ? 'text-[#1B1C21]' : 'text-[#CBCCCD]'
              } pt-1 font-manrope-bold text-xs`}>
              Send
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MonoIcon color={focused ? '#1B1C21' : '#CBCCCD'} iconName="ArrowUpFromDot" />
          ),
        }}
        name="Send"
        component={Send}
      />
    </Tab.Navigator>
  );
};

export default WalletNavigation;
