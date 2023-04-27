import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import { Pressable, ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import { useMenuItems } from './menu-items';
import { MenuStackParamList } from './menu-navigation';

type Props = StackScreenProps<MenuStackParamList, 'MenuList'>;

const Menu = ({ navigation }: Props) => {
  const categories = useMenuItems();

  return (
    <LayoutComponent noPadding>
      <Title style="ml-8 mb-8">Settings</Title>
      <ScrollView className="flex h-full flex-col px-4 pl-4">
        {categories.map(({ items, name }) => (
          <View key={name} className="border-b border-slate-100 px-4">
            <Text className="pb-4 font-manrope-bold text-xl">{name}</Text>

            {items.map(item => (
              <Pressable
                className="flex flex-row items-center justify-start pb-6"
                key={item.name}
                onPress={() => {
                  item.type === 'link' ? navigation.navigate(item.screen) : item.onPress();
                }}>
                <View>
                  <Text className="font-inter-medium text-lg">{item.name}</Text>
                  <Text className="font-inter text-sm text-slate-400">{item.subText}</Text>
                </View>

                <MonoIcon style="ml-auto" iconName={item.icon} />
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </LayoutComponent>
  );
};

export default Menu;
