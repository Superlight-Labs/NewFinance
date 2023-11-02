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
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 0 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">1. </Text>
            <TextInput
              className="w-full items-baseline pb-[2px] font-manrope text-base font-semibold"
              placeholder="Type in phrase"
              onChangeText={value => addWord(value, 0)}
              autoFocus={true}
              onFocus={() => setWordCount(0)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 1 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">2. </Text>
            <TextInput
              ref={el => (inputRefs.current[1] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 1)}
              onFocus={() => setWordCount(1)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 2 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">3. </Text>
            <TextInput
              ref={el => (inputRefs.current[2] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 2)}
              onFocus={() => setWordCount(2)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 3 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">4. </Text>
            <TextInput
              ref={el => (inputRefs.current[3] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 3)}
              onFocus={() => setWordCount(3)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 4 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">5. </Text>
            <TextInput
              ref={el => (inputRefs.current[4] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 4)}
              onFocus={() => setWordCount(4)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 5 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">6. </Text>
            <TextInput
              ref={el => (inputRefs.current[5] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 5)}
              onFocus={() => setWordCount(5)}
            />
          </View>
        </View>
        <View className="flex w-1/2 flex-col space-y-2">
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 6 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">7. </Text>
            <TextInput
              ref={el => (inputRefs.current[6] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 6)}
              onFocus={() => setWordCount(6)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 7 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">8. </Text>
            <TextInput
              ref={el => (inputRefs.current[7] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 7)}
              onFocus={() => setWordCount(7)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 8 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">9. </Text>
            <TextInput
              ref={el => (inputRefs.current[8] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 8)}
              onFocus={() => setWordCount(8)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 9 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">10. </Text>
            <TextInput
              ref={el => (inputRefs.current[9] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 9)}
              onFocus={() => setWordCount(9)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 10 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">11. </Text>
            <TextInput
              ref={el => (inputRefs.current[10] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 10)}
              onFocus={() => setWordCount(10)}
            />
          </View>
          <View
            className={`flex-row items-baseline rounded-sm px-3 py-1.5 ${
              wordCount === 11 ? 'bg-[#F4F5F5]' : 'bg-transparent'
            }`}>
            <Text className="font-manrope text-base font-semibold">12. </Text>
            <TextInput
              ref={el => (inputRefs.current[11] = el)}
              className="w-full pb-[2px] font-manrope text-base font-semibold"
              onChangeText={value => addWord(value, 11)}
              onFocus={() => setWordCount(11)}
            />
          </View>
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
