import Clipboard from '@react-native-clipboard/clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
//import * as Sharing from 'expo-sharing';
import QRCodeStyled from 'react-native-qrcode-styled';
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

  const shareAdress = () => {
    console.log('should share');
    //Sharing.shareAsync(`bitcoin:${external.address}`);
  };

  return (
    <WalletLayout>
      <View className="flex flex-1 flex-col  pb-8">
        <View className="flex items-center justify-center px-14">
          <QRCodeStyled
            data={`bitcoin:${external.address}`}
            // eslint-disable-next-line react-native/no-inline-styles
            padding={20}
            innerEyesOptions={{
              borderRadius: 8,
              color: '#000',
            }}
            outerEyesOptions={{
              borderRadius: 12,
            }}
            logo={{
              href: require('../../../../assets/images/logo.png'),
              padding: 12,
              scale: 1.5,
              width: 30,
              height: 20,
            }}
            pieceSize={8}
            pieceBorderRadius={4}
          />
          <Text className="text-center font-manrope text-xs font-medium text-[#636360]">
            Scan your QR-Code with a smartphone and get money sent directly.
          </Text>
          <Button style="bg-[#F0F6F2] max-w-44 mr-4 mt-6" onPress={shareAdress}>
            <Text className="text-black">SHARE</Text>
          </Button>
        </View>
        <View className="mt-6 w-full border-t-[1px] border-[#F6F6F8] px-6 pt-6">
          <Text className="font-manrope text-base font-bold">Receive</Text>
          <Pressable
            onPress={copyToClipboard}
            className="mt-6 flex-row items-center justify-between">
            <View>
              <Text className="font-manrope text-sm font-semibold text-[#8E8D92]">BTC</Text>
              <Text className="font-manrope text-base font-semibold">
                {shortenAddress(external.address)}
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <MonoIcon width={16} height={16} iconName="Copy" color="#0AAFFF" />
              <Text className="font-manrope text-sm font-semibold text-[#0AAFFF]">Copy</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </WalletLayout>
  );
};

export default Receive;
