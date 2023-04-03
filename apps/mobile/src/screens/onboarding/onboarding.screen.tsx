import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { Text, View } from 'util/wrappers/styled-react-native';
import { OnboardingParamList } from './onboarding-navigation';

type Props = StackScreenProps<OnboardingParamList, 'OnboardingOverview'>;

const Onboarding = ({ navigation }: Props) => {
  return (
    <View className="flex h-full w-full flex-col p-8 pt-24">
      <Title>Onboarding</Title>

      <Text>Hello, welcome to Superlight. Next step is to create your wallet.</Text>
      <Text>
        You can either generate a new one, or import an existing wallet by your passphrase
      </Text>

      <Button
        style="my-4"
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
    </View>
  );
};

export default Onboarding;
