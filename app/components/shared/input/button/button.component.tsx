import {styled} from 'nativewind';
import {ReactNode} from 'react';
import {Text, TouchableNativeFeedback} from 'react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
};

const StyledButton = styled(TouchableNativeFeedback);
const StyledText = styled(Text);

const Button = ({onPress, children}: Props) => (
  <StyledButton onPress={onPress}>
    <StyledText>{children}</StyledText>
  </StyledButton>
);

export default Button;
