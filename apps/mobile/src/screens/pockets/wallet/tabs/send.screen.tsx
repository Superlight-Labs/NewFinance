import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import { PocketsStackParamList, SendStackList } from 'screens/pockets/pockets-navigation';
import ScanQrScreen from '../stacks/scan-qr.scren';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendReviewScreen from '../stacks/send-review.screen';
import SendToScreen from '../stacks/send-to.screen';

const Stack = createStackNavigator<SendStackList>();

type Props = StackScreenProps<PocketsStackParamList, 'Send'>;

const SendScreen = ({ route }: Props) => {
  const { external } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SendAmount"
        initialParams={{ sender: external }}
        component={SendAmountScreen}
      />
      <Stack.Screen name="SendTo" component={SendToScreen} />
      <Stack.Screen name="ScanQrCode" component={ScanQrScreen} />
      <Stack.Screen name="SendReview" component={SendReviewScreen} />
    </Stack.Navigator>
  );
};

export default SendScreen;
