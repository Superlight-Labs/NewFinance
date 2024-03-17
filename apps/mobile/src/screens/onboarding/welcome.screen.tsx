import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import { RootStackParamList } from 'src/app-navigation';
import { openWebsite } from 'utils/web-opener';
import { Image, Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

const homePageUrl = 'https://www.getnewfinance.com';

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const Welcome = ({ navigation }: Props) => {
  return (
    <SafeAreaView className="bg-white">
      <Image
        source={require('../../../assets/images/bg_welcome.png')}
        resizeMode="cover"
        className="absolute h-1/3 w-full"
      />

      <View className="flex h-full flex-col items-stretch justify-between  px-6 pt-8">
        <View className="h-24"></View>
        <View className="flex flex-row items-center justify-between">
          <View>
            <View className="w-ful mb-2 flex flex-row items-center">
              <Image
                source={require('../../../assets/images/logo.png')}
                resizeMode="contain"
                className="mr-1 h-3 w-3"
              />
              <Text className="font-manrope text-base font-semibold text-black">NewFinance</Text>
              <View className="ml-1 mt-[-12px] rounded bg-[#0AAFFF] p-0.5">
                <Text className=" font-manrope text-xs font-semibold text-black">Alpha</Text>
              </View>
            </View>

            <Text className="font-manrope text-[28px] font-semibold leading-[32px]">
              Make your money{'\n'}saver than ever
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Image
              source={require('../../../assets/images/btc_welcome.png')}
              resizeMode="contain"
              className="mt-4 max-h-32 w-28 "
            />
          </View>
        </View>
        <View className="mb-3">
          <Button
            style="bg-[#0AAFFF]"
            onPress={() => navigation.navigate('Onboarding', { withPhrase: false })}>
            Create a new wallet
          </Button>
          <Pressable
            className="flex items-center justify-center py-6"
            onPress={() => navigation.navigate('OnboardingPhrase')}>
            <Text className="font-manrope text-base font-semibold text-black">
              Add an existing wallet
            </Text>
          </Pressable>
          <View className="mt-3 px-12">
            <Text className="text-center font-manrope text-xs font-semibold text-[#8E8D95]">
              By continuing, I agree to the
              <Pressable
                className="mt-[-3px]"
                onPress={() => openWebsite(homePageUrl + '/privacy')}>
                <Text className="text-center font-manrope text-xs font-semibold text-[#0AAFFF]">
                  {' '}
                  Terms of Service{' '}
                </Text>
              </Pressable>
              and consent to the
              <Pressable
                className="mt-[-3px]"
                onPress={() => openWebsite(homePageUrl + '/privacy')}>
                <Text className="text-center font-manrope text-xs font-semibold text-[#0AAFFF]">
                  {' '}
                  Privacy Policy{' '}
                </Text>
              </Pressable>
              .
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
