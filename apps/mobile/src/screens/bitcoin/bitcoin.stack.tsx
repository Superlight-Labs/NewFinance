import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable } from 'utils/wrappers/styled-react-native';
import { BitcoinStackParamList } from './bitcoin-navigation';
import Bitcoin from './bitcoin.screen';
import BuyBitcoinStack from './pages/buy-bitcoin.stack';
import SellBitcoinScreen from './pages/sell-bitcoin.screen';
import PriceNotification from './price-notification.screen';

const Stack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator<BitcoinStackParamList>();

type Props = StackScreenProps<BitcoinStackParamList, 'BitcoinStack'>;

const BitcoinStack = ({ navigation }: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BitcoinScreen"
        options={{
          title: 'Bitcoin',
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
          headerLargeTitleStyle: {
            fontFamily: 'system',
            fontWeight: '700',
            fontSize: 32,
          },
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <Pressable
              onPress={() => {
                navigation.navigate('PriceNotification');
              }}
              className="ml-0.5">
              <MonoIcon iconName="BellRing" strokeWitdth={2.5} />
            </Pressable>
          ),
        }}>
        {() => (
          <SubStack.Navigator initialRouteName="Bitcoin" screenOptions={{ headerShown: false }}>
            <SubStack.Screen name="Bitcoin" component={Bitcoin} />
            <SubStack.Screen
              name="PriceNotification"
              component={PriceNotification}
              options={{ presentation: 'modal' }}
            />
            <SubStack.Screen
              name="BuyBitcoinStack"
              component={BuyBitcoinStack}
              options={{ presentation: 'modal' }}
            />
            <SubStack.Screen
              name="SellBitcoin"
              component={SellBitcoinScreen}
              options={{ presentation: 'modal' }}
            />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default BitcoinStack;
