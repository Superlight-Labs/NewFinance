/* eslint-disable react/no-unstable-nested-components */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TransitionPresets } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Receive from 'screens/wallet/tabs/receive.screen';
import Send from 'screens/wallet/tabs/send.screen';
import { WalletScreenList } from 'screens/wallet/wallet-navigation';
import Wallet from 'screens/wallet/wallet.screen';
import { RootStack } from 'src/App';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = /*StackScreenProps<RootStackParamList, 'Wallet'> & */ {
  Stack: RootStack;
};

const Tab = createMaterialTopTabNavigator<WalletScreenList>();

const WalletStack = ({ Stack }: Props) => {
  return (
    <Stack.Group
      screenOptions={{
        presentation: 'modal',
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}>
      <Stack.Screen name="Wallet">
        {({ navigation }) => (
          <View className="flex h-full w-full bg-white">
            <Pressable className="ml-auto mr-4 mt-4" onPress={() => navigation.navigate('Home')}>
              <MonoIcon style=" p-2 rounded-full bg-slate-100" iconName="Minimize2" />
            </Pressable>
            <Tab.Navigator tabBarPosition="bottom" initialRouteName="Overview">
              <Tab.Screen
                name="Recieve"
                options={{
                  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
                  tabBarLabel: ({ focused }) => (
                    <Text
                      className={`${
                        focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'
                      } text-xs font-bold`}>
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
                    <Text
                      className={`${
                        focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'
                      } text-xs font-bold`}>
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
                    <Text
                      className={`${
                        focused ? 'text-[#6986F8]' : 'text-[#8D93A0]'
                      } text-xs font-bold`}>
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
          </View>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default WalletStack;
