import {styled} from 'nativewind';
import {Text, View} from 'react-native';

const StyledView = styled(View);

const Home = () => {
  return (
    <StyledView className="flex h-full w-full flex-col items-center justify-center pb-8">
      <Text>Hi this is home</Text>
    </StyledView>
  );
};

export default Home;
