import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BitcoinStackParamList } from './bitcoin-navigation';
import Bitcoin from './bitcoin.screen';

const Stack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator<BitcoinStackParamList>();

const BitcoinStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bitcoin"
        options={{
          headerLargeTitle: true,
          headerShadowVisible: true,
          headerLargeTitleShadowVisible: false,
        }}>
        {() => (
          <SubStack.Navigator initialRouteName="Bitcoin" screenOptions={{ headerShown: false }}>
            <SubStack.Screen name="Bitcoin" component={Bitcoin} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default BitcoinStack;
