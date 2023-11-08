import { styled } from 'nativewind';
import { KeyboardType } from 'react-native';
import { TextInput } from 'utils/wrappers/styled-react-native';

type Props = {
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  style?: string;
  disabled?: boolean;
  keyboardType?: KeyboardType;
  maxLength?: number;
  onPressIn?: () => void;
};

const MultilineText = ({
  value,
  setValue,
  placeholder,
  style,
  keyboardType = 'default',
  disabled = false,
  maxLength = 1000,
  onPressIn,
}: Props) => {
  const bg = disabled ? 'bg-slate-100' : 'bg-slate-50';

  return (
    <TextInput
      editable={!disabled}
      selectTextOnFocus={!disabled}
      autoCapitalize="none"
      scrollEnabled
      multiline
      onPressIn={onPressIn}
      autoCorrect={false}
      autoComplete="off"
      keyboardType={keyboardType}
      placeholder={placeholder}
      onChangeText={setValue}
      value={value}
      maxLength={maxLength}
      className={` border-slate-400 p-4 shadow-lg ${bg} ${style}`}
    />
  );
};

export default styled(MultilineText);
