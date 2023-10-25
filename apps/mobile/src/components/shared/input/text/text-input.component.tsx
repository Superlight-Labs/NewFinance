import { styled } from 'nativewind';
import { InputModeOptions, KeyboardType } from 'react-native';
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
  inputMode?: InputModeOptions;
  autoFocus?: boolean;
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
  inputMode = 'text',
  autoFocus = false,
}: Props) => {
  return (
    <TextInput
      placeholderTextColor="#91969D"
      className={`border-1 h-12 border-b border-[#D4D4D5] font-manrope text-lg font-medium ${style}`}
      defaultValue={defaultValue}
      editable={!disabled}
      value={value}
      placeholder={placeHolder}
      onChangeText={onChangeText}
      autoCapitalize={autoCorrect ? 'sentences' : 'none'}
      autoCorrect={autoCorrect}
      keyboardType={keyboardType}
      inputMode={inputMode}
      autoFocus={autoFocus}
    />
  );
};

export default styled(Input);
