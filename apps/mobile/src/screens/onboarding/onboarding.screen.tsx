import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import { RootStackParamList } from 'screens/main-navigation';
import { Pressable, Text, View } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

const Onboarding = ({ navigation }: Props) => {
  return (
    <View className="flex h-full w-full flex-col p-8 pt-24">
      <Pressable
        className="ml-auto flex w-12 items-center justify-center"
        onPress={() => navigation.navigate('Menu')}>
        <MonoIcon iconName="Settings" />
      </Pressable>
      <Title>Onboarding</Title>

      <Text>Hello, welcome to Superlight. Next step is to create your wallet.</Text>
      <Text className="mb-24">
        You can either generate a new one, or import an existing wallet by your passphrase
      </Text>

      <Button
        onPress={function (): void {
          navigation.navigate('Create');
        }}>
        Create new Wallet
      </Button>
      <Button
        style="my-4"
        onPress={function (): void {
          navigation.navigate('Import');
        }}>
        Import Existing Wallet
      </Button>
    </View>
  );
};

export default Onboarding;
