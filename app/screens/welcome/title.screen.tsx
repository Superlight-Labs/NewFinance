import {styled} from 'nativewind';
import {View} from 'react-native';
import Button from '../../components/shared/input/button.component';
import MonoIcon from '../../components/shared/mono-icon.component';

const StyledView = styled(View);

const Title = () => (
  <StyledView className="flex h-full w-full items-center justify-center">
    <MonoIcon iconName="Send" />
    <Button onPress={() => {}}>Get started</Button>
  </StyledView>
);

export default Title;
