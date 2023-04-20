import { styled } from 'nativewind';
import { KeyboardType } from 'react-native';
import { TextInput } from 'utils/wrappers/styled-react-native';

type Props = {
  onChangeText: (val: string) => void;
  value: string;
  defaultValue?: string;
  style?: string;
  disabled?: boolean;
  placeHolder?: string;
  autoCorrect?: boolean;
  keyboardType?: KeyboardType;
};

const Input = ({
  onChangeText,
  value,
  style,
  placeHolder,
  defaultValue,
  autoCorrect = false,
  disabled = false,
  keyboardType = 'default',
}: Props) => {
  return (
    <TextInput
      className={`border-800 h-8 border-b ${style}`}
      defaultValue={defaultValue}
      editable={!disabled}
      value={value}
      placeholder={placeHolder}
      onChangeText={onChangeText}
      autoCapitalize={autoCorrect ? 'sentences' : 'none'}
      autoCorrect={autoCorrect}
      keyboardType={keyboardType}
    />
  );
};

export default styled(Input);
