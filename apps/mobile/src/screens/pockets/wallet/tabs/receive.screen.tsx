import Clipboard from '@react-native-clipboard/clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
//import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import QRCodeStyled from 'react-native-qrcode-styled';
import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';
import { useSnackbarState } from 'state/snackbar.state';
import { shortenAddress } from 'utils/string';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<PocketsStackParamList, 'Receive'>;

const ReceiveStack = ({ route }: Props) => {
  const { external } = route.params;
  const { setMessage } = useSnackbarState();

  const [showQrCode, setShowQrCode] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState<boolean>(false);

  useEffect(() => {
    // Fügen Sie hier eine Verzögerung oder asynchrone Logik hinzu
    const delayToShowQrCode = setTimeout(() => {
      setShowQrCode(true);
    }, 0);

    return () => {
      // Stellen Sie sicher, dass der Timer beim Entfernen der Komponente aufgeräumt wird
      clearTimeout(delayToShowQrCode);
    };
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(external.address);
    setMessage({ level: 'info', message: 'Copied your Address to clipboard' });
  };

  const shareAdress = () => {
    console.log('should share');
    //Sharing.shareAsync(`bitcoin:${external.address}`);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="mt-12 flex flex-1 flex-col pb-8">
        <View className="flex items-center justify-center px-14">
          {showQrCode && (
            <QRCodeStyled
              data={`bitcoin:${external.address}`}
              padding={20}
              innerEyesOptions={{
                borderRadius: 8,
                color: '#000',
              }}
              outerEyesOptions={{
                borderRadius: 12,
              }}
              logo={{
                href: require('../../../../../assets/images/logo.png'),
                padding: 12,
                scale: 1.5,
                width: 30,
                height: 20,
              }}
              pieceSize={8}
              pieceBorderRadius={4}
            />
          )}
          <Text className="mt-2 text-center font-manrope text-xs font-medium text-[#636360]">
            Scan your QR-Code with a smartphone and get money sent directly.
          </Text>
          <Button style="bg-[#F0F6F2] w-44 mt-6" onPress={shareAdress}>
            <Text className=" text-black">SHARE</Text>
          </Button>
        </View>
        <View className="mx-5 mt-6 border-t-[1px] border-[#F6F6F8] pt-12">
          <Text className="font-manrope text-lg font-bold">My address</Text>
          <Pressable
            onPress={copyToClipboard}
            className="mt-6 flex-row items-center justify-between">
            <View>
              <Text className="mb-0.5 font-manrope-semibold text-base">BTC</Text>
              <Pressable onPress={() => setShowFullAddress(!showFullAddress)}>
                <Text className="mt-0.5 rounded bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium text-xs text-grey">
                  {showFullAddress ? external.address : shortenAddress(external.address)}
                </Text>
              </Pressable>
            </View>
            <View className="flex-row items-center space-x-1">
              <MonoIcon width={16} height={16} iconName="Copy" color="#0AAFFF" />
              <Text className="font-manrope text-sm font-semibold text-[#0AAFFF]">Copy</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReceiveStack;
