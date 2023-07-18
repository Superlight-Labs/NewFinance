import Clipboard from '@react-native-clipboard/clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import QRCode from 'react-native-qrcode-svg';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useSnackbarState } from 'state/snackbar.state';
import { shortenAddress } from 'utils/string';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import { WalletTabList } from '../wallet-navigation';

type Props = StackScreenProps<WalletTabList, 'Recieve'>;

const Receive = ({ route }: Props) => {
  const { external } = route.params;
  const { setMessage } = useSnackbarState();

  const copyToClipboard = () => {
    Clipboard.setString(external.address);
    setMessage({ level: 'info', message: 'Copied your Address to clipboard' });
  };

  return (
    <WalletLayout>
      <View className="flex flex-1 flex-col items-center  pb-8">
        <Title style="mb-2">Scan Address</Title>
        <View className="flex h-[50%] w-[50%] items-center justify-center">
          <QRCode
            value={`bitcoin:${external.address}}`}
            logoBackgroundColor="transparent"
            size={240}
            logoSize={70}
            logo={require('../../../../assets/images/logo.png')}
          />
        </View>

        <Pressable
          onPress={copyToClipboard}
          className="mt-12 flex flex-row items-center justify-center">
          <Text className="mr-2 text-xl">{shortenAddress(external.address)}</Text>
          <MonoIcon iconName="Copy" />
        </Pressable>

        <Text className="mx-12 mt-auto text-center font-manrope-bold text-slate-400">
          Other Superlight users can scan this QR Code to send you Bitcoin!
        </Text>
      </View>
    </WalletLayout>
  );
};

export default Receive;
