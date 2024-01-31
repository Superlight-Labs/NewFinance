import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';

import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Snackbar from 'components/shared/snackbar/snackbar.component';
import { PocketsStackParamList, SendStackList } from 'screens/pockets/pockets-navigation';
import { useSnackbarState } from 'state/snackbar.state';
import { Pressable } from 'utils/wrappers/styled-react-native';
import ChooseFeesScreen from '../stacks/choose-fees.screen';
import ScanQrScreen from '../stacks/scan-qr.scren';
import SendAmountScreen from '../stacks/send-amount.screen';
import SendReviewScreen from '../stacks/send-review.screen';
import SendToScreen from '../stacks/send-to.screen';

const Stack = createNativeStackNavigator<SendStackList>();

type Props = StackScreenProps<PocketsStackParamList, 'Send'>;

const SendStack = ({ navigation: _, route }: Props) => {
  const { external } = route.params;
  const { message } = useSnackbarState();

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

  const stackOptions = ({ navigation: _ }: any) => ({
    title: 'Send',
    headerLargeTitle: false,
    headerShadowVisible: false,
    headerShown: true,
  });

  return (
    <>
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
        <Stack.Screen
          name="ChooseFees"
          options={{
            presentation: 'containedTransparentModal',
            gestureEnabled: true,
            headerShown: false,
          }}
          component={ChooseFeesScreen}
        />
      </Stack.Navigator>
      {message.level !== 'empty' && <Snackbar appMessage={message} />}
    </>
  );
};

export default SendStack;
