import { wordlist } from '@scure/bip39/wordlists/english';
import Button from 'components/shared/input/button/button.component';
import TextInputComponent from 'components/shared/input/text/text-input.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useEffect, useState } from 'react';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  setPhrase: (phrase: string) => void;
};

const RecoveryPhraseInputComponent = ({ setPhrase }: Props) => {
  const [word, setWord] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const pieces = word.split(' ');

    if (pieces.length === 1) {
      const piece = pieces[0];
      const allMatching = wordlist.filter(w => w.startsWith(piece));

      if (allMatching.length === 1 && allMatching[0] === piece) {
        setSelected([...selected, piece]);
        setWord('');
      }

      return;
    }

    const newSelection = [...selected, ...pieces.filter(p => wordlist.includes(p))];

    setSelected(newSelection);
    setWord('');
  }, [word, selected]);

  useEffect(() => {
    if (selected.length === 12) {
      setPhrase(selected.join(' '));
      return;
    }
  }, [selected, setPhrase]);

  const removeLast = () => {
    const newSelected = [...selected];
    newSelected.pop();
    setSelected(newSelected);
  };

  const removeAll = () => {
    setSelected([]);
  };

  return (
    <View className="flex h-full w-full">
      <View className="flex w-full flex-row items-center border-b border-b-slate-200 py-2">
        <View className="flex-1">
          <Text className="font-inter-medium">Recovery phrase</Text>
          <TextInputComponent
            disabled={selected.length >= 12}
            style="border-b-0"
            value={word}
            onChangeText={setWord}
          />
        </View>
        <View className="flex h-12 w-12 items-center justify-center rounded-lg bg-black p-3">
          <MonoIcon color="white" iconName="ListRestart" />
        </View>
      </View>
      <View className="mt-8 flex w-full flex-row justify-around">
        <View className="flex w-[25vw] flex-col">
          <Text className="font-inter-medium">1. {selected.at(0)}</Text>
          <Text className="font-inter-medium">2. {selected.at(1)}</Text>
          <Text className="font-inter-medium">3. {selected.at(2)}</Text>
          <Text className="font-inter-medium">4. {selected.at(3)}</Text>
          <Text className="font-inter-medium">5. {selected.at(4)}</Text>
          <Text className="font-inter-medium">6. {selected.at(5)}</Text>
        </View>
        <View className="flex w-[25vw] flex-col">
          <Text className="font-inter-medium">7. {selected.at(6)}</Text>
          <Text className="font-inter-medium">8. {selected.at(7)}</Text>
          <Text className="font-inter-medium">9. {selected.at(8)}</Text>
          <Text className="font-inter-medium">10. {selected.at(9)}</Text>
          <Text className="font-inter-medium">11. {selected.at(10)}</Text>
          <Text className="font-inter-medium">12. {selected.at(11)}</Text>
        </View>
      </View>
      <View className="mt-8 flex w-full flex-row justify-center">
        <Button style="pt-3 bg-white border-2 w-32 rounded-xl mr-4" onPress={removeLast}>
          <MonoIcon iconName="Delete" />
        </Button>
        <Button style="pt-3 bg-white border-2 w-32 rounded-xl ml-4" onPress={removeAll}>
          <MonoIcon iconName="XCircle" />
        </Button>
      </View>
    </View>
  );
};

export default RecoveryPhraseInputComponent;
