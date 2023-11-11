import { useState } from 'react';
import { ScrollView } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';

type Props = {};

const Bitcoin = ({}: Props) => {
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
    </ScrollView>
  );
};

export default Bitcoin;
