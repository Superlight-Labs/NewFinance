import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { ReactNode } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { useSnackbarState } from 'state/snackbar.state';
import { Pressable, View } from 'utils/wrappers/styled-react-native';

type Props = {
  children: ReactNode;
  leftHeader?: 'copy' | 'back' | 'none';
  rightHeader?: 'close' | 'none';
  style?: string;
};

const WalletLayout = ({ children, rightHeader = 'close', leftHeader = 'none', style }: Props) => {
  const navigator = useNavigation();

  const {
    indexAddress: { address },
  } = useBitcoinState();

  const { setMessage } = useSnackbarState();

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setMessage({ level: 'info', message: 'Copied your Address to clipboard' });
  };

  return (
    <View className={`flex h-full w-full flex-col bg-white ${style}`}>
      <View className="flex flex-row p-4">
        <>
          {leftHeader === 'copy' && (
            <Pressable className="flex flex-col items-center" onPress={copyToClipboard}>
              <MonoIcon style="p-2 rounded-full bg-slate-100" iconName="Clipboard" />
            </Pressable>
          )}
          {leftHeader === 'back' && (
            <Pressable className="flex flex-col items-center" onPress={navigator.goBack}>
              <MonoIcon style="p-2 rounded-full bg-slate-100" iconName="ArrowLeft" />
            </Pressable>
          )}
        </>
        <>
          {rightHeader === 'close' && (
            <Pressable className="ml-auto" onPress={() => navigator.navigate('Home' as never)}>
              <MonoIcon style="p-2 rounded-full bg-slate-100" iconName="Minimize2" />
            </Pressable>
          )}
        </>
      </View>
      {children}
    </View>
  );
};

export default WalletLayout;
