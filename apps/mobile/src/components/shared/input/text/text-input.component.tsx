import { styled } from 'nativewind';
import { InputModeOptions, KeyboardType } from 'react-native';
import { TextInput, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onChangeText: (val: string) => void;
  onBlur?: (val: any) => void;
  value: string;
  defaultValue?: string;
  style?: string;
  disabled?: boolean;
  placeHolder?: string;
  autoCorrect?: boolean;
  autoCapitalize?: boolean;
  keyboardType?: KeyboardType;
  inputMode?: InputModeOptions;
  autoFocus?: boolean;
};

const Input = ({
  onChangeText,
  onBlur,
  value,
  style,
  placeHolder,
  defaultValue,
  autoCorrect = false,
  autoCapitalize = false,
  disabled = false,
  keyboardType = 'default',
  inputMode = 'text',
  autoFocus = false,
}: Props) => {
  return (
    <View className="flex-">
      <TextInput
        placeholderTextColor="#BFC3C1"
        className={`border-1 border-b border-[#D4D4D5] py-0 font-manrope text-base font-semibold leading-[22px] text-black ${style}`}
        defaultValue={defaultValue}
        editable={!disabled}
        value={value}
        placeholder={placeHolder}
        textAlignVertical={'top'}
        onChangeText={onChangeText}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize ? 'words' : 'none'}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        inputMode={inputMode}
        autoFocus={autoFocus}
        enablesReturnKeyAutomatically={true}
      />
    </View>
  );
};

export default styled(Input);
