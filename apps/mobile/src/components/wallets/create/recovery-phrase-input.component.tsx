import { wordlist } from '@scure/bip39/wordlists/english';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import React, { useEffect, useRef, useState } from 'react';
import { Clipboard, Keyboard } from 'react-native';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'utils/wrappers/styled-react-native';

type Props = {
  setPhrase: (phrase: string) => void;
};

const RecoveryPhraseInputComponent = ({ setPhrase }: Props) => {
  const [selected, setSelected] = useState<string[]>(['', '', '', '', '', '', '', '', '', '', '']);
  const inputRefs = useRef<any[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);
  const scrollViewRef = React.useRef(null);

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
      scrollToCenter(wordCount + 1);

      setWordCount(wordCount + 1);
      if (wordCountValue !== 11) {
        inputRefs.current[wordCount + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    scrollToCenter(0); // Scrollen Sie zum ersten Element
  }, []);

  const pastePhrase = async () => {
    const text = await Clipboard.getString();
    const wordsArray = text.split(' ');
    setSelected(wordsArray);
    inputRefs.current.forEach((ref, index) => {
      if (ref && wordsArray[index] !== undefined) {
        ref.setNativeProps({ text: wordsArray[index] });
      }
    });
    setWordCount(wordsArray.filter(Boolean).length);
    scrollToCenter(11);
    Keyboard.dismiss();
  };

  const scrollToCenter = (index: number) => {
    const offset = (index + 1) * 170 - 122;
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <View>
      <ScrollView
        horizontal={true}
        ref={scrollViewRef}
        className="h-20"
        showsHorizontalScrollIndicator={false}
        snapToInterval={170}
        decelerationRate={'fast'}
        snapToAlignment={'center'}>
        <View className="w-[170px]" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
          <View
            key={'seed-workd-view-' + num}
            className="mx-[10px] h-14 w-[150px] justify-center rounded-lg border-2 border-[#F5F5F5] px-3">
            <TextInput
              className="font-manrope text-3xl font-semibold text-black"
              placeholder="Word"
              placeholderTextColor="#CECECE"
              ref={el => (inputRefs.current[num] = el)}
              onChangeText={value => addWord(value, num)}
              autoFocus={num === 0 ? true : false}
              onFocus={() => setWordCount(num)}
              keyboardAppearance="light"
              includeFontPadding={false}
            />
          </View>
        ))}
        <View className="w-[170px]" />
      </ScrollView>
      {wordCount === 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => pastePhrase()}
          className="absolute bottom-0 left-0 right-0 top-11 items-center justify-center ">
          <View className="flex-row items-center rounded bg-[#ceefff] px-2.5 py-1">
            <Text className="mr-1 font-manrope-semibold text-base text-[#0AAFFF]">Paste</Text>
            <MonoIcon
              iconName="Copy"
              color="#0AAFFF"
              width={14}
              height={14}
              strokeWitdth={2.5}
              style="mt-0.5"
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RecoveryPhraseInputComponent;
