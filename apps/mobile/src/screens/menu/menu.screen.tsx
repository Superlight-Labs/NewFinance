import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { Switch } from 'react-native';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { Image, Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { useMenuItems } from './menu-items';
import { MenuStackParamList } from './menu-navigation';

type Props = StackScreenProps<MenuStackParamList, 'Menu'>;

const Menu = ({ navigation }: Props) => {
  const categories = useMenuItems();
  const { user } = useAuthState();
  const { getTotalBalance } = useBitcoinState();

  return (
    <ScrollView
      className="bg-white px-5"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-row items-center">
        <Image
          source={require('../../../assets/images/logo.png')}
          resizeMode="contain"
          className="mr-3 mt-0.5 h-6 w-6"
        />
        <Text className="font-manrope text-lg font-semibold">{user?.username}</Text>
      </View>
      <View className="mt-12 flex-row justify-between">
        <Text className="font-manrope text-xl font-bold">Balance</Text>
        <PriceTextComponent
          style="font-manrope text-xl font-bold"
          bitcoinAmount={getTotalBalance()}
        />
      </View>
      <Pressable className="mb-12 mt-6 rounded bg-[#F8F8F8] active:opacity-70">
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="font-manrope text-xs font-bold">
            Invite your friends. Get 30 € bonus.
          </Text>
          <MonoIcon height={14} width={14} iconName={'ChevronRight'} />
        </View>
      </Pressable>
      <View className="">
        {categories.map(({ items, name }) => (
          <View key={name} className="mb-6 border-b-[1.5px] border-[#F6F7F8] pb-5">
            <Text className="font-manrope-bold text-xl">{name}</Text>

            {items.map(item => (
              <Pressable
                className="mt-6 flex flex-row items-center justify-between"
                key={item.name}
                onPress={() => {
                  item.type === 'link' ? navigation.navigate(item.screen) : item.onPress();
                }}>
                <View>
                  <Text className="mb-0.5 font-manrope-semibold text-base">{item.name}</Text>
                  <Text className="font-manrope text-xs font-semibold text-[#8D8C91]">
                    {item.subText}
                  </Text>
                </View>
                {item.type === 'switch' ? (
                  <Switch disabled={true} value={item.value} onValueChange={item.onValueChange} />
                ) : (
                  <MonoIcon iconName={item.icon} />
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Menu;
