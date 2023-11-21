import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import { useState } from 'react';
import { ScrollView, View } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';
import { BitcoinStackParamList } from './bitcoin-navigation';

type Props = StackScreenProps<BitcoinStackParamList, 'Bitcoin'>;

const Bitcoin = ({ navigation }: Props) => {
  const [scrollViewEnabled, setScrollViewEnabled] = useState<boolean>(true);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white"
      horizontal={false}
      scrollEnabled={scrollViewEnabled}>
      <BitcoinPreview
        onChartStart={() => setScrollViewEnabled(false)}
        onChartRelease={() => setScrollViewEnabled(true)}
      />
      <View className="mt-12 flex w-full flex-row justify-between px-5">
        <ButtonComponent
          onPress={() => navigation.navigate('SellBitcoin')}
          style="bg-[#F0F6F2] flex-1 mr-1"
          textStyle="text-black">
          Sell
        </ButtonComponent>

        <ButtonComponent
          onPress={() => navigation.navigate('BuyBitcoin')}
          style="flex-1 bg-[#51DC78] ml-1">
          Buy
        </ButtonComponent>
      </View>
    </ScrollView>
  );
};

export default Bitcoin;
