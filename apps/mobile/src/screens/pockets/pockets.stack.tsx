import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import SetupWallet from 'screens/onboarding/slides/setup-wallet.screen';
import { Pressable } from 'utils/wrappers/styled-react-native';
import CreatePocket from './create/create-pocket.screen';
import { PocketsStackParamList } from './pockets-navigation';
import Pockets from './pockets.screen';
import TransactionDetailsScreen from './wallet/stacks/transaction-details.screen';
import ReceiveStack from './wallet/tabs/receive.screen';
import SendStack from './wallet/tabs/send.stack';
import Wallet from './wallet/tabs/wallet.screen';

const Stack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator<PocketsStackParamList>();

type Props = StackScreenProps<PocketsStackParamList, 'Pockets'>;

const PocketsStack = ({ navigation }: Props) => {
  const substackScreensOptions = ({ navigation }: any) => ({
    title: 'Main Pocket',
    headerLargeTitle: true,
    headerShadowVisible: false,
    headerShown: true,
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        className="ml-0.5">
        <MonoIcon iconName="ArrowLeft" />
      </Pressable>
    ),
  });

  return (
    <Stack.Navigator>
      <Stack.Screen name="Pockets" options={{ headerShown: false }}>
        {() => (
          <SubStack.Navigator initialRouteName="Pockets" screenOptions={{ headerShown: false }}>
            <SubStack.Screen
              name="Pockets"
              component={Pockets}
              options={{
                headerShown: true,
                title: 'Balance',
                headerLargeTitle: true,
                headerShadowVisible: true,
                headerLargeTitleShadowVisible: false,
                headerLargeTitleStyle: {
                  fontFamily: 'system',
                  fontWeight: '700',
                  fontSize: 32,
                },
              }}
            />
            <SubStack.Screen name="Wallet" component={Wallet} options={substackScreensOptions} />
            <SubStack.Screen
              name="CreatePocket"
              component={CreatePocket}
              options={{
                presentation: 'modal',
              }}
            />
            <SubStack.Screen
              name="TransactionDetails"
              component={TransactionDetailsScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <SubStack.Screen
              name="Send"
              component={SendStack}
              options={{
                presentation: 'modal',
              }}
            />
            <SubStack.Screen
              name="Receive"
              component={ReceiveStack}
              options={{
                presentation: 'modal',
              }}
            />
            <SubStack.Screen name="SetupWallet" component={SetupWallet} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default PocketsStack;
