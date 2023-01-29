import {styled} from 'nativewind';
import {Text, View} from 'react-native';

const StyledView = styled(View);

const Wallet = () => {
  return (
    <StyledView className="flex w-full flex-col items-center justify-center pb-8">
      <Text>Hi this is aasdf Wallet Screen</Text>

      <StyledView className="flex w-full flex-col items-center justify-center"></StyledView>
    </StyledView>
  );
};

export default Wallet;
