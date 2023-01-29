import {styled} from 'nativewind';
import {Text, View} from 'react-native';

const StyledView = styled(View);

const Overview = () => {
  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <Text>Hi this is a Wallet Overview Screen</Text>
    </StyledView>
  );
};

export default Overview;
