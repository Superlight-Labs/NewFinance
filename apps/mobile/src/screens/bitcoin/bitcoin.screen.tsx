import { ScrollView } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';

type Props = {};

const Bitcoin = ({}: Props) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white">
      <BitcoinPreview />
    </ScrollView>
  );
};

export default Bitcoin;
