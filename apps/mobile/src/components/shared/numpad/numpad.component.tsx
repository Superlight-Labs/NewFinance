import * as Haptics from 'expo-haptics';
import { useGeneralState } from 'state/general.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

type Props = {
  value: string;
  setValue: (value: string) => void;
  maxLength?: number;
  style?: string;
};

const Numpad = ({ value, setValue, maxLength = 10, style = '' }: Props) => {
  const { currency } = useGeneralState();

  const updateState = (num: string) => {
    if (value.length >= maxLength) return;
    // get last char from value
    const lastChar = value.slice(-1);

    if ((lastChar === '.' || value.includes('.')) && num === '.') return;

    if ((value === '0' || value === '') && num === '.') {
      setValue('0.');
      return;
    }

    if (value === '0') {
      setValue(num);
      return;
    }

    setValue(value + num);
  };

  const removeLast = () => {
    if (value.length === 1) {
      setValue('0');
    } else {
      setValue(value.slice(0, value.length - 1));
    }
  };

  return (
    <View className={`w-full flex-row flex-wrap ${style}`}>
      {numbers.map(num => (
        <Key key={num} num={num} update={updateState} />
      ))}
      {currency !== 'sats' ? (
        <Key num="." update={updateState} />
      ) : (
        <Key num="" update={updateState} />
      )}

      <Key num="0" update={updateState} />
      <Key num="<" update={removeLast} />
    </View>
  );
};

const Key = ({ num, update }: { num: string; update: (num: string) => void }) => {
  return (
    <Pressable
      className="flex flex-[0_0_33%] items-center p-6"
      key={num}
      onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      onPress={() => update(num)}>
      <Text className="font-manrope text-2xl font-semibold">{num}</Text>
    </Pressable>
  );
};

export default Numpad;
