import { StackScreenProps } from '@react-navigation/stack';
import logger from '@superlight-labs/logger';
import bip21 from 'bip21';
import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { BarCodeEvent, BarCodeScanner, PermissionResponse } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { SendStackList } from 'screens/pockets/pockets-navigation';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<SendStackList, 'ScanQrCode'>;

const ScanQrScreen = ({ navigation, route }: Props) => {
  const { sender, currency, amount } = route.params;
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

      navigation.navigate('SendTo', { sender, recipient: scan.address, amount, currency });
    } catch (e) {
      logger.warn({ e }, 'Invalid QR code');
    }
  };

  return (
    <View className="h-full bg-white">
      <View className="  pt-12">
        {permission === null && <Text>Requesting for camera permission</Text>}
        {permission?.status === 'denied' && permission.canAskAgain && (
          <View className="flex-col items-center justify-center">
            <Text className="mt-24 font-manrope font-bold text-slate-400">No access to camera</Text>
            <ButtonComponent style="mx-12 mt-6" onPress={getBarCodeScannerPermissions}>
              Tap to allow camera access
            </ButtonComponent>
          </View>
        )}
        {permission?.status === 'denied' && !permission.canAskAgain && (
          <View className="flex-col items-center justify-center">
            <Text className="mt-24 font-manrope font-bold text-grey">No access to camera</Text>
            <Text className="mt-6 text-center font-manrope font-bold text-grey">
              Please enable NewFinance to use Camera in the Settings of your phone
            </Text>
          </View>
        )}
        {permission?.granted && (
          <View className="absolute h-screen w-full rounded-lg bg-red-400">
            <BarCodeScanner
              style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 20 }}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}>
              <View className="mt-4 flex-row items-center justify-between px-5">
                <View />
                <Text className="font-manrope font-bold text-white">Scan QR Code</Text>
                <Pressable onPress={() => navigation.pop()}>
                  <MonoIcon color="#FFFFFF" iconName="X" />
                </Pressable>
              </View>
              <View className="h-full w-full items-center justify-center p-12 pb-[50%]">
                <View className="aspect-square w-full rounded-xl border-[2px] border-white" />
                {scanned && (
                  <ButtonComponent
                    style=" m-12 absolute bottom-24"
                    onPress={() => setScanned(false)}>
                    Tap to Scan Again
                  </ButtonComponent>
                )}
              </View>
            </BarCodeScanner>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScanQrScreen;
