import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { OnboardingParamList } from './onboarding-navigation';

type Props = StackScreenProps<OnboardingParamList, 'OnboardingOverview'>;

const Onboarding = ({ navigation }: Props) => {
  return (
    <Layout style="flex h-full w-full flex-col p-8 pt-24">
      <Title>Onboarding</Title>

      <Button
        onPress={function (): void {
          navigation.navigate('Import');
        }}>
        Import Existing Wallet
      </Button>
      <Button
        onPress={function (): void {
          navigation.navigate('Create');
        }}>
        Create new Wallet
      </Button>
    </Layout>
  );
};

export default Onboarding;
