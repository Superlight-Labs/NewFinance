import { RootStack } from 'src/App.navigation';
import CreateWallet from './slides/create-wallet.screen';
import ImportWallet from './slides/import-wallet.screen';
import OnboardingScreen from './slides/onboarding.screen';
import ReviewCreate from './slides/review-create.screen';
import SetupWallet from './slides/setup-wallet.screen';

type Props = {
  Stack: RootStack;
};

const OnboardingStack = ({ Stack }: Props) => {
  return (
    <Stack.Group>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SetupWallet" component={SetupWallet} />
      <Stack.Screen name="Import" component={ImportWallet} />
      <Stack.Screen name="Create" component={CreateWallet} />
      <Stack.Screen name="ReviewCreate" component={ReviewCreate} />
    </Stack.Group>
  );
};

export default OnboardingStack;
