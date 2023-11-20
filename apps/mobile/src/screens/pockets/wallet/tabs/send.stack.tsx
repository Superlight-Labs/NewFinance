import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';

import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { PocketsStackParamList, SendStackList } from 'screens/pockets/pockets-navigation';
import { Pressable } from 'utils/wrappers/styled-react-native';
import ScanQrScreen from '../stacks/scan-qr.scren';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendReviewScreen from '../stacks/send-review.screen';
import SendToScreen from '../stacks/send-to.screen';

const Stack = createNativeStackNavigator<SendStackList>();

type Props = StackScreenProps<PocketsStackParamList, 'Send'>;

const SendStack = ({ navigation, route }: Props) => {
  const { external } = route.params;

  const screensOptions = ({ navigation }: any) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        className="ml-0">
        <MonoIcon iconName="ArrowLeft" />
      </Pressable>
    ),
  });

  const noTitleOptions = ({ navigation }: any) => ({
    title: '',
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        className="ml-0">
        <MonoIcon iconName="ArrowLeft" />
      </Pressable>
    ),
  });

  const stackOptions = ({ navigation }: any) => ({
    title: 'Send',
    headerLargeTitle: false,
    headerShadowVisible: false,
    headerShown: true,
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => null,
  });

  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name="SendAmount"
        initialParams={{ sender: external }}
        component={SendAmountScreen}
      />
      <Stack.Screen name="SendTo" component={SendToScreen} options={screensOptions} />
      <Stack.Screen
        name="ScanQrCode"
        component={ScanQrScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="SendReview" component={SendReviewScreen} options={noTitleOptions} />
    </Stack.Navigator>
  );
};

export default SendStack;
