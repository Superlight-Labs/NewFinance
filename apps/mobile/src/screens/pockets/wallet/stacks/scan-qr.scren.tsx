import { StackScreenProps } from '@react-navigation/stack';
import logger from '@superlight-labs/logger';
import bip21 from 'bip21';
import ButtonComponent from 'components/shared/input/button/button.component';
import Title from 'components/shared/title/title.component';
import { BarCodeEvent, BarCodeScanner, PermissionResponse } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { SendStackList } from 'screens/pockets/pockets-navigation';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<SendStackList, 'ScanQrCode'>;

const ScanQrScreen = ({ navigation, route }: Props) => {
  const { sender } = route.params;
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [scanned, setScanned] = useState(false);

  const getBarCodeScannerPermissions = async () => {
    const res = await BarCodeScanner.requestPermissionsAsync();
    setPermission(res);
  };

  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
    setScanned(true);

    try {
      const scan = bip21.decode(data);

      navigation.navigate('SendTo', { sender, recipient: scan.address });
    } catch (e) {
      logger.warn({ e }, 'Invalid QR code');
    }
  };

  return (
    <WalletLayout leftHeader="back" rightHeader="none">
      <View className="flex flex-1 items-center  pt-12">
        <Title style="mb-4">Scan Bitcoin QR Code</Title>
        {permission === null && <Text>Requesting for camera permission</Text>}
        {permission?.status === 'denied' && permission.canAskAgain && (
          <View className="flex-col items-center justify-center">
            <Text className="mt-24 font-manrope-bold text-slate-400">No access to camera</Text>
            <ButtonComponent style="mx-12 mt-6 rounded-lg" onPress={getBarCodeScannerPermissions}>
              Tap to allow camera access
            </ButtonComponent>
          </View>
        )}
        {permission?.status === 'denied' && !permission.canAskAgain && (
          <View className="flex-col items-center justify-center">
            <Text className="mt-24 font-manrope-bold text-slate-400">No access to camera</Text>
            <Text className="mt-6 text-center font-manrope-bold text-slate-400">
              Please enable NewFinance to use Camera in the Settings of your phone
            </Text>
          </View>
        )}
        {permission?.granted && (
          <View className="h-[50%] w-full">
            <BarCodeScanner
              style={{ height: '100%', width: '100%' }}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
          </View>
        )}
        {scanned && (
          <ButtonComponent style=" m-12 rounded-lg" onPress={() => setScanned(false)}>
            Tap to Scan Again
          </ButtonComponent>
        )}
      </View>
    </WalletLayout>
  );
};

export default ScanQrScreen;
