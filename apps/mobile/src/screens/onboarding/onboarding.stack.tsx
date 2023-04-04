import { RootStack } from 'src/App';
import Onboarding from './onboarding.screen';
import CreateWallet from './slides/create-wallet.screen';
import ImportWallet from './slides/import-wallet.screen';
import ReviewCreate from './slides/review-create.screen';

type Props = {
  Stack: RootStack;
};

const OnboardingStack = ({ Stack }: Props) => {
  return (
    <Stack.Group>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Import" component={ImportWallet} />
      <Stack.Screen name="Create" component={CreateWallet} />
      <Stack.Screen name="ReviewCreate" component={ReviewCreate} />
    </Stack.Group>
  );
};

export default OnboardingStack;
