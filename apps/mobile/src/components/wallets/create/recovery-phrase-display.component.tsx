import Clipboard from '@react-native-clipboard/clipboard';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useSnackbarState } from 'state/snackbar.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  phrase: string;
};

const RecoveryPhraseDisplayComponent = ({ phrase }: Props) => {
  const words = phrase.split(' ');
  const { setMessage } = useSnackbarState();

  const copyToClipboard = () => {
    Clipboard.setString(phrase);
    setMessage({
      level: 'info',
      message:
        'Copied your phrase to clipboard! Please consider writing it down on a piece of paper for safety!',
    });
  };

  return (
    <View className=" flex h-full w-full">
      <View className="flex w-full flex-row items-center py-2">
        <View className="flex-1">
          <Text className="font-inter-medium">Recovery phrase</Text>
        </View>
        <View className="flex h-12 w-12 items-center justify-center rounded-lg bg-black p-3">
          <MonoIcon color="white" iconName="ListRestart" />
        </View>
      </View>
      <View className="mt-8 flex w-full flex-row justify-around">
        <View className="flex w-[25vw] flex-col">
          <Text className="font-inter-medium">1. {words.at(0)}</Text>
          <Text className="font-inter-medium">2. {words.at(1)}</Text>
          <Text className="font-inter-medium">3. {words.at(2)}</Text>
          <Text className="font-inter-medium">4. {words.at(3)}</Text>
          <Text className="font-inter-medium">5. {words.at(4)}</Text>
          <Text className="font-inter-medium">6. {words.at(5)}</Text>
        </View>
        <View className="flex w-[25vw] flex-col">
          <Text className="font-inter-medium">7. {words.at(6)}</Text>
          <Text className="font-inter-medium">8. {words.at(7)}</Text>
          <Text className="font-inter-medium">9. {words.at(8)}</Text>
          <Text className="font-inter-medium">10. {words.at(9)}</Text>
          <Text className="font-inter-medium">11. {words.at(10)}</Text>
          <Text className="font-inter-medium">12. {words.at(11)}</Text>
        </View>
      </View>
      <Pressable
        className="mt-8 flex w-2/3 flex-row items-center justify-center self-center rounded-xl border-2 bg-white px-2 py-2 pt-3"
        onPress={copyToClipboard}>
        <Text className="mr-4 font-inter-medium text-black">Copy to clipboard!</Text>
        <MonoIcon iconName="ClipboardCopy" />
      </Pressable>
      <View className="left-0 right-0 mt-8 flex flex-row">
        <MonoIcon color="#8D93A0" iconName="Info" />
        <Text className="text-slate-400"> We use a standard BIP84 derivation path</Text>
      </View>
    </View>
  );
};

export default RecoveryPhraseDisplayComponent;
