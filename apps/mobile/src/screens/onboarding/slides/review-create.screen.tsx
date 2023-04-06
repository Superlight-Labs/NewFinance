import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import Layout from 'components/shared/layout/layout.component';
import Title from 'components/shared/title/title.component';
import { RootStackParamList } from 'screens/main-navigation';
import { Text } from 'util/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'ReviewCreate'>;

const ReviewCreate = ({ navigation, route }: Props) => {
  const { walletName, showSeed, seed } = route.params;
  const finishGenerate = () => {
    navigation.navigate('Home');
  };

  return (
    <Layout>
      <ButtonComponent
        style="px-6 py-3 absolute right-8 -top-12 rounded-xl"
        onPress={finishGenerate}>
        Finish
      </ButtonComponent>
      <Title>Review Settings and finish</Title>

      <Text>Name: {walletName}</Text>
      {showSeed && <Text>Seed: {seed}</Text>}
    </Layout>
  );
};

export default ReviewCreate;
