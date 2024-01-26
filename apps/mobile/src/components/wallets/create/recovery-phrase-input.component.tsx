import { wordlist } from '@scure/bip39/wordlists/english';
import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { Text, TextInput, View } from 'utils/wrappers/styled-react-native';

type Props = {
  setPhrase: (phrase: string) => void;
};

const RecoveryPhraseInputComponent = ({ setPhrase }: Props) => {
  const [selected, setSelected] = useState<string[]>(['', '', '', '', '', '', '', '', '', '', '']);
  const inputRefs = useRef<any[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);

  useEffect(() => {
    if (selected.length === 12) {
      setPhrase(selected.join(' '));
      return;
    }
    console.log(selected);
  }, [selected, setPhrase]);

  const addWord = (value: string, wordCountValue: number) => {
    if (wordlist.find(w => w === value.toLowerCase())) {
      const newSelection = [
        ...selected.slice(0, wordCountValue),
        value.toLowerCase(),
        ...selected.slice(wordCountValue + 1),
      ];
      setSelected(newSelection);

      setWordCount(wordCount + 1);
      if (wordCountValue !== 11) {
        inputRefs.current[wordCount + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  return (
    <View className="w-ful mt-10 flex">
      <View className=" flex w-full flex-row space-x-2">
        <View className="flex w-1/2 flex-col space-y-2">
          {[0, 1, 2, 3, 4, 5].map(num => (
            <View
              className={`flex-row items-center justify-center rounded-sm px-3 py-1.5 ${
                wordCount === num ? 'bg-[#F4F5F5]' : 'bg-transparent'
              }`}>
              <Text className="font-manrope text-base font-semibold">{num + 1}. </Text>
              <TextInput
                className="w-full items-baseline font-manrope text-base font-semibold"
                placeholder="Type in phrase"
                placeholderTextColor="#BFC3C1"
                ref={el => (inputRefs.current[num] = el)}
                onChangeText={value => addWord(value, num)}
                autoFocus={true}
                onFocus={() => setWordCount(num)}
              />
            </View>
          ))}
        </View>
        <View className="flex w-1/2 flex-col space-y-2">
          {[6, 7, 8, 9, 10, 11].map(num => (
            <View
              className={`flex-row items-center justify-center rounded-sm px-3 py-1.5 ${
                wordCount === num ? 'bg-[#F4F5F5]' : 'bg-transparent'
              }`}>
              <Text className="font-manrope text-base font-semibold">{num + 1}. </Text>
              <TextInput
                ref={el => (inputRefs.current[num] = el)}
                className="w-full font-manrope text-base font-semibold"
                onChangeText={value => addWord(value, num)}
                placeholder="Type in phrase"
                placeholderTextColor="#BFC3C1"
                onFocus={() => setWordCount(num)}
              />
            </View>
          ))}
        </View>
      </View>

      <View className="left-0 right-0 mt-8 flex flex-row">
        <Text className="font-manrope text-xs font-medium text-grey">
          We use a standard BIP84 derivation path. Please note, if you import your own seed phrase,
          our extensive security system will not take full effect as your seed phrase has already
          been created outside our system.
        </Text>
      </View>
    </View>
  );
};

export default RecoveryPhraseInputComponent;
