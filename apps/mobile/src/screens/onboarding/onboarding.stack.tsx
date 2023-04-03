import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import { RootStack } from 'src/App';
import { OnboardingParamList } from './onboarding-navigation';
import Onboarding from './onboarding.screen';
import CreateWallet from './slides/create-wallet.screen';
import ImportWallet from './slides/import-wallet.screen';

type Props = {
  Stack: RootStack;
};

const SubStack = createStackNavigator<OnboardingParamList>();
const screenOptions: StackNavigationOptions = {
  headerLeft: () => null,
};
const OnboardingStack = ({ Stack }: Props) => {
  return (
    <Stack.Group
      screenOptions={{
        gestureEnabled: true,
        headerLeft: () => null,
      }}>
      <Stack.Screen name="Onboarding">
        {() => (
          <SubStack.Navigator initialRouteName="OnboardingOverview" screenOptions={screenOptions}>
            <SubStack.Screen name="OnboardingOverview" component={Onboarding} />
            <SubStack.Screen name="Import" component={ImportWallet} />
            <SubStack.Screen name="Create" component={CreateWallet} />
          </SubStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Group>
  );
};

export default OnboardingStack;
