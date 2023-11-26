import ButtonComponent from 'components/shared/input/button/button.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { useState } from 'react';
import { Share } from 'react-native';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'utils/wrappers/styled-react-native';

const infos = [
  {
    heading1: 'Invite 3 friends',
    text1: 'Send invitations to NewFinance to 3 friends.',
    heading2: 'Friends accept invitations',
    text2:
      'Your invited friends accept the invitations an create/import at least one wallet with NewFinance.',
    heading3: 'Get rewarded with main release',
    text3:
      'You get the full version of NewFinance for free with the release of the main NewFinance version.',
  },
  {
    heading1: 'Invite 6 friends',
    text1: 'Send invitations to NewFinance to 6 friends.',
    heading2: 'Friends accept invitations',
    text2:
      'Your invited friends accept the invitations an create/import at least one wallet with NewFinance.',
    heading3: 'Get rewarded with main release',
    text3: 'You get the a 30€ bonus in Bitcoin with the main release of NewFinance',
  },
];

const InviteFriends = () => {
  const [shownBenefit, setShownBenefit] = useState<number>(0);

  const shareInvitation = async () => {
    await Share.share({
      message: 'NewFinance | Invest and secure your futur.',
      url: 'https://getnewfinance.com',
    });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="mt-12">
        <Text className="mx-5 font-[system] text-[32px] font-[700] leading-[32px] text-black">
          Invite friends
        </Text>
        <ScrollView horizontal={true} className="px-5">
          <View className="mt-6 flex flex-row justify-between">
            <Pressable
              onPress={() => setShownBenefit(0)}
              className={`mr-3 flex-1 items-center rounded  px-6 py-6  ${
                shownBenefit === 0 ? 'bg-[#EEEEEE]' : 'bg-[#F8F8F8]'
              }`}>
              <Text className="font-manrope text-sm font-semibold text-grey">3 friends</Text>
              <Text className="font-manrope text-lg font-bold">Free full version</Text>
            </Pressable>
            <Pressable
              onPress={() => setShownBenefit(1)}
              className={`mr-3 flex-1 items-center rounded  px-10 py-6  ${
                shownBenefit === 1 ? 'bg-[#EEEEEE]' : 'bg-[#F8F8F8]'
              }`}>
              <Text className="font-manrope text-sm font-semibold text-grey">6 friends</Text>
              <Text className="font-manrope text-lg font-bold">30€ Bonus</Text>
            </Pressable>
          </View>
        </ScrollView>
        <View className="mt-10 px-5">
          <Text className="font-manrope text-lg font-bold">How it works </Text>
          <View>
            <View className="mt-6 flex-row">
              <View className="mr-2">
                <MonoIcon height={16} width={16} iconName="CircleDot" style="mt-0.5" />
              </View>
              <View>
                <Text className="font-manrope text-sm font-bold">
                  {infos[shownBenefit].heading1}
                </Text>
                <Text className="font-manrope text-sm font-medium text-grey">
                  {infos[shownBenefit].text1}
                </Text>
              </View>
            </View>
            <View className="mt-6 flex-row">
              <View className="mr-2">
                <MonoIcon height={16} width={16} iconName="Circle" style="mt-0.5" color="#8E8D95" />
              </View>
              <View>
                <Text className="font-manrope text-sm font-bold">
                  {infos[shownBenefit].heading2}
                </Text>
                <Text className="font-manrope text-sm font-medium text-grey">
                  {infos[shownBenefit].text2}
                </Text>
              </View>
            </View>
            <View className="mt-6 flex-row">
              <View className="mr-2">
                <MonoIcon height={16} width={16} iconName="Circle" style="mt-0.5" color="#8E8D95" />
              </View>
              <View>
                <Text className="font-manrope text-sm font-bold">
                  {infos[shownBenefit].heading3}
                </Text>
                <Text className="font-manrope text-sm font-medium text-grey">
                  {infos[shownBenefit].text3}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-12 w-full px-5">
        <ButtonComponent onPress={shareInvitation} style="bg-[#3385FF]" textStyle="text-white">
          Share
        </ButtonComponent>
      </View>
    </SafeAreaView>
  );
};

export default InviteFriends;
