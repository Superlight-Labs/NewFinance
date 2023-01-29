import {styled} from 'nativewind';
import {ReactNode} from 'react';
import {Pressable, Text} from 'react-native';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: string;
};

const StyledButton = styled(Pressable);
const StyledText = styled(Text);

const Button = ({onPress, children, style}: Props) => (
  <StyledButton
    onPress={onPress}
    className={`${style} rounded-full bg-slate-800 p-4`}>
    <StyledText className="text-white">{children}</StyledText>
  </StyledButton>
);

export default styled(Button);
