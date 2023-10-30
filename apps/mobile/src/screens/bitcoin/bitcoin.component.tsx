import LayoutComponent from 'components/shared/layout/layout.component';
import { SafeAreaView, ScrollView } from 'utils/wrappers/styled-react-native';
import BitcoinPreview from '../../components/wallets/bitcoin/bitcoin-preview.component';

type Props = {};

const Bitcoin = ({}: Props) => {
  return (
    <SafeAreaView className="">
      <LayoutComponent>
        <ScrollView>
          <BitcoinPreview />
        </ScrollView>
      </LayoutComponent>
    </SafeAreaView>
  );
};

export default Bitcoin;
