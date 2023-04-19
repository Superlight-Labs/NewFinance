import { styled } from 'nativewind';
import { TextInput } from 'utils/wrappers/styled-react-native';

type Props = {
  onChangeText: (val: string) => void;
  value: string;
  defaultValue?: string;
  style?: string;
  disabled?: boolean;
  placeHolder?: string;
  autoCorrect?: boolean;
};

const Input = ({
  onChangeText,
  value,
  style,
  placeHolder,
  defaultValue,
  autoCorrect = false,
  disabled = false,
}: Props) => {
  return (
    <TextInput
      className={`border-800 h-8 w-64 border-b ${style}`}
      defaultValue={defaultValue}
      editable={!disabled}
      value={value}
      placeholder={placeHolder}
      onChangeText={onChangeText}
      autoCapitalize={autoCorrect ? 'sentences' : 'none'}
      autoCorrect={autoCorrect}
    />
  );
};

export default styled(Input);
