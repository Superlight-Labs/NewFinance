import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import { useBitcoinState } from 'state/bitcoin.state';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendReviewScreen from '../stacks/send-review.screen';
import SendToScreen from '../stacks/send-to.screen';
import { WalletStackList, WalletTabList } from '../wallet-navigation';

const Stack = createStackNavigator<WalletStackList>();

type Props = StackScreenProps<WalletTabList, 'Send'>;

const Send = ({ route }: Props) => {
  const { getAccExternalAddress } = useBitcoinState();
  const { account } = route.params;

  const sender = getAccExternalAddress(account);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendTo" initialParams={{ sender }} component={SendToScreen} />
      <Stack.Screen name="SendAmount" component={SendAmountScreen} />
      <Stack.Screen name="SendReview" component={SendReviewScreen} />
    </Stack.Navigator>
  );
};

export default Send;
