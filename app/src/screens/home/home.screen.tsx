import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Button from 'components/shared/input/button/button.component';
import {Text, View} from 'custom/styled-react-native';
import {RootStackParamList} from 'src/navigation/main-navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const Home = ({navigation}: Props) => {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center pb-8">
      <Text>Hi this is home</Text>

      <Button onPress={() => navigation.navigate('Wallet')}>
        Open Main Wallet
      </Button>
    </View>
  );
};

export default Home;
