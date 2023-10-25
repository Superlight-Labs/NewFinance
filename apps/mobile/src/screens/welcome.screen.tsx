import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import WelcomeCarousel from 'components/welcome-screen/welcome-carousel.component';
import { styled } from 'nativewind';
import { View } from 'react-native';
import { RootStackParamList } from 'screens/main-navigation';
import { Image, Pressable, SafeAreaView, Text } from 'utils/wrappers/styled-react-native';

const StyledView = styled(View);

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {
  return (
    <SafeAreaView className="">
      <Image
        source={require('../../assets/images/bg_welcome.png')}
        resizeMode="cover"
        className="absolute right-[-300px]"
      />

      <StyledView className="flex h-full flex-col items-stretch justify-between  pt-8">
        <StyledView className="px-6">
          <StyledView className="w-ful flex flex-row items-center">
            <Image
              source={require('../../assets/images/logo_white.png')}
              resizeMode="contain"
              className="mr-1 h-6 w-6"
            />
            <Text className="font-manrope text-xl font-semibold text-white">NewFinance</Text>
          </StyledView>
          <Text className="ml-8 mt-[-4] font-manrope text-xs font-semibold text-white">
            Alpha Version
          </Text>
        </StyledView>
        <StyledView className="mx-[-1rem] max-h-[500px]">
          <WelcomeCarousel />
        </StyledView>
        <StyledView className="px-6">
          <StyledView className="flex items-center py-4 opacity-50">
            <Text className="font-manrope text-sm font-semibold text-white">
              Regularly 4,99€/month - now for free
            </Text>
          </StyledView>
          <Button onPress={() => navigation.navigate('Onboarding')}>CREATE ACCOUNT FOR FREE</Button>
          <Pressable className="flex items-center justify-center py-4">
            <Text className="font-manrope text-sm font-semibold text-white">
              Already have a bitcoin wallet?
            </Text>
          </Pressable>
        </StyledView>
      </StyledView>
    </SafeAreaView>
  );
};

export default Welcome;
