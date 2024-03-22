import { styled } from 'nativewind';
import { InputModeOptions } from 'react-native';
import { TextInput, View } from 'utils/wrappers/styled-react-native';

type Props = {
  onChangeText: (val: string) => void;
  onBlur?: (val: any) => void;
  value: string;
  defaultValue?: string;
  style?: string;
  containerStyle?: string;
  disabled?: boolean;
  placeHolder?: string;
  autoCorrect?: boolean;
  autoCapitalize?: boolean;
  textContentType?: any;
  inputMode?: InputModeOptions;
  autoFocus?: boolean;
};

const Input = ({
  onChangeText,
  onBlur,
  value,
  style,
  containerStyle,
  placeHolder,
  defaultValue,
  autoCorrect = false,
  autoCapitalize = false,
  disabled = false,
  textContentType = 'none',
  inputMode = 'text',
  autoFocus = false,
}: Props) => {
  return (
    <View className={`flex-1 ${containerStyle}`}>
      <TextInput
        placeholderTextColor="#BFC3C1"
        className={`border-1 border-b border-[#D4D4D5] py-0 font-manrope text-base font-semibold text-black ${style}`}
        defaultValue={defaultValue}
        editable={!disabled}
        value={value}
        placeholder={placeHolder}
        textAlignVertical={'bottom'}
        onChangeText={onChangeText}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize ? 'words' : 'none'}
        autoCorrect={autoCorrect}
        textContentType={textContentType}
        inputMode={inputMode}
        autoFocus={autoFocus}
        enablesReturnKeyAutomatically={true}
      />
    </View>
  );
};

export default styled(Input);
