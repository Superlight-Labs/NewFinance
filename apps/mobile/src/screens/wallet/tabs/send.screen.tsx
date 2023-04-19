import { createStackNavigator } from '@react-navigation/stack';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendToScreen from '../stacks/send-to.screen';
import { WalletStackList } from '../wallet-navigation';

const Stack = createStackNavigator<WalletStackList>();

const Send = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendTo" component={SendToScreen} />
      <Stack.Screen name="SendAmount" component={SendAmountScreen} />
    </Stack.Navigator>
  );
};

export default Send;
