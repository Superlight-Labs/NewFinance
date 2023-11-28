import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable } from 'utils/wrappers/styled-react-native';
import { BuyBitcoinStackParamList } from './buy-bitcoin-navigation';
import BuyBitcoinReviewScreen from './buy-bitcoin-review.screen';
import BuyBitcoinScreen from './buy-bitcoin.screen';

const Stack = createNativeStackNavigator<BuyBitcoinStackParamList>();

const BuyBitcoinStack = () => {
  const screensOptions = ({ navigation }: any) => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        className="ml-0">
        <MonoIcon iconName="ArrowLeft" />
      </Pressable>
    ),
  });

  const stackOptions = ({}: any) => ({
    headerShown: false,
    // eslint-disable-next-line react/no-unstable-nested-components
    headerLeft: () => null,
  });

  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="BuyBitcoin" component={BuyBitcoinScreen} />
      <Stack.Screen
        name="BuyBitcoinReview"
        component={BuyBitcoinReviewScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  );
};

export default BuyBitcoinStack;
