import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Button from 'components/shared/input/button/button.component';
import {styled} from 'nativewind';
import {Text, View} from 'react-native';
import {RootStackParamList} from 'src/navigation/main-navigation';

const StyledView = styled(View);

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const Home = ({navigation}: Props) => {
  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <Text>Hi this is home</Text>

      <Button onPress={() => navigation.navigate('Wallet')}>
        Open Main Wallet
      </Button>
    </StyledView>
  );
};

export default Home;
