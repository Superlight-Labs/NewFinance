import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { ReactNode } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { useSnackbarState } from 'state/snackbar.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  leftHeader?: 'copy' | 'back' | 'none';
  address?: string;
  rightHeader?: 'close' | 'none' | 'empty';
  middleHeader?: 'value' | 'none';
  style?: string;
  value?: string;
};

const WalletLayout = ({
  children,
  address = '',
  rightHeader = 'close',
  leftHeader = 'none',
  middleHeader = 'none',
  style,
  value,
}: Props) => {
  const navigator = useNavigation();

  const {} = useBitcoinState();

  const { setMessage } = useSnackbarState();

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setMessage({ level: 'info', message: 'Copied your Address to clipboard' });
  };

  return (
    <View className={`flex h-full w-full flex-col bg-white px-4 ${style}`}>
      <View className="flex flex-row items-center py-6">
        <>
          {leftHeader === 'copy' && (
            <Pressable className="flex flex-col items-center" onPress={copyToClipboard}>
              <View className="flex-row items-center space-x-2">
                <View className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                  <View className="flex h-4 w-4 items-center justify-center rounded-sm bg-black">
                    <Text className="font-manrope-bold text-[10px] leading-[14px] text-white">
                      $
                    </Text>
                  </View>
                </View>
                <Text className="font-manrope font-semibold">Main pocket</Text>
              </View>
            </Pressable>
          )}
          {leftHeader === 'back' && (
            <Pressable className="flex flex-col items-center" onPress={navigator.goBack}>
              <MonoIcon style="p-2" iconName="ArrowLeft" />
            </Pressable>
          )}
        </>
        <>
          {middleHeader === 'value' && (
            <Pressable className="ml-auto" onPress={navigator.goBack}>
              <Text className="font-base font-manrope font-semibold">Send {value}</Text>
            </Pressable>
          )}
        </>
        <>
          {rightHeader === 'close' && (
            <Pressable className="ml-auto" onPress={() => navigator.navigate('Home' as never)}>
              <MonoIcon style="p-2" iconName="X" />
            </Pressable>
          )}
          {rightHeader === 'empty' && <View className="ml-auto w-4" />}
        </>
      </View>
      {children}
    </View>
  );
};

export default WalletLayout;
