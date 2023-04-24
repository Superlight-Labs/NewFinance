import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import ScanQrScreen from '../stacks/scan-qr.scren';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendReviewScreen from '../stacks/send-review.screen';
import SendToScreen from '../stacks/send-to.screen';
import { WalletStackList, WalletTabList } from '../wallet-navigation';

const Stack = createStackNavigator<WalletStackList>();

type Props = StackScreenProps<WalletTabList, 'Send'>;

const Send = ({ route }: Props) => {
  const { external } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendTo" initialParams={{ sender: external }} component={SendToScreen} />
      <Stack.Screen name="ScanQrCode" component={ScanQrScreen} />
      <Stack.Screen name="SendAmount" component={SendAmountScreen} />
      <Stack.Screen name="SendReview" component={SendReviewScreen} />
    </Stack.Navigator>
  );
};

export default Send;
