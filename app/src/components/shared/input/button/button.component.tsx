import {styled} from 'nativewind';
import {ReactNode} from 'react';
import {Text, TouchableOpacity} from 'react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
};

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

const Button = ({onPress, children}: Props) => (
  <StyledButton onPress={onPress} className=" rounded-full bg-slate-800 p-2">
    <StyledText className="text-gray-50">{children}</StyledText>
  </StyledButton>
);

export default Button;
