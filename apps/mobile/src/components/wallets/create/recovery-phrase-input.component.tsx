import { wordlist } from '@scure/bip39/wordlists/english';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { ScrollView, TextInput, View } from 'utils/wrappers/styled-react-native';

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

  const scrollToCenter = (index: number) => {
    const offset = (index + 1) * 170 - 122;
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <ScrollView
      horizontal={true}
      ref={scrollViewRef}
      className=""
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
          />
        </View>
      ))}
      <View className="w-[170px]" />
    </ScrollView>
  );
};

export default RecoveryPhraseInputComponent;
