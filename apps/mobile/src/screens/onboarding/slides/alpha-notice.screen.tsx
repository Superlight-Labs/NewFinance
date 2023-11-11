import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { RootStackParamList } from 'src/app-navigation';
import { SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<RootStackParamList, 'AlphaNotice'>;

const AlphaNoticeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <View className="flex h-full justify-between ">
        <View className="mt-24 items-center  px-4">
          <Text className="text-center font-manrope text-3xl font-semibold">
            Your first{'\n'}pocket is ready
          </Text>
          <View className="mt-10 flex-row">
            <MonoIcon iconName="CheckCheck" width={16} height={16} />
            <Text className="ml-1 font-manrope text-xs font-medium text-grey">
              Note that NewFinance is currently in the alpha test version. This means, no real money
              is involved and it’s only for testing purpose - you get benefits for testing the app.
            </Text>
          </View>
          <View className="mt-8 w-full justify-center border-t border-[#ECF2EF] pt-8">
            <Text className="text-center font-manrope text-xl font-semibold">
              Benefits from testing NewFinance
            </Text>
            <View className="mt-6 flex flex-col space-y-3">
              <View className="w-full flex-row justify-between space-x-3">
                <View className="flex-1 items-center justify-center rounded bg-[#F8F8F8] p-8">
                  <MonoIcon iconName="Check" />
                  <Text className="mt-1 text-center font-manrope text-base font-semibold">
                    Free for lifetime
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center rounded bg-[#F8F8F8] p-8">
                  <MonoIcon iconName="Euro" />
                  <Text className="mt-1 text-center font-manrope text-base font-semibold">
                    Lower fees
                  </Text>
                </View>
              </View>
              <View className="w-full flex-row justify-between space-x-3">
                <View className="flex-1 items-center justify-center rounded bg-[#F8F8F8] p-8">
                  <MonoIcon iconName="Send" />
                  <Text className="mt-1 text-center font-manrope text-base font-semibold">
                    Cheaper transactions
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center rounded bg-[#F8F8F8] p-8">
                  <MonoIcon iconName="Percent" />
                  <Text className="mt-1 text-center font-manrope text-base font-semibold">
                    50€ bonus in Bitcoin
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="w-full px-4">
          <Text className="mb-2 font-manrope text-xs font-medium text-grey">
            Benefits will be rewarded after testing certain features.
          </Text>
          <Button onPress={() => navigation.goBack()}>I UNDERSTAND</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AlphaNoticeScreen;
