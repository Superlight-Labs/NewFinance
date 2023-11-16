import { StackScreenProps } from '@react-navigation/stack';
import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<PocketsStackParamList, 'TransactionDetails'>;

const TransactionDetailsScreen = ({ navigation, route }: Props) => {
  return (
    <View>
      <Text>Wallet Details</Text>
    </View>
  );
};

export default TransactionDetailsScreen;
