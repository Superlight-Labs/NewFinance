import { StackScreenProps } from '@react-navigation/stack';
import LayoutComponent from 'components/shared/layout/layout.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Title from 'components/shared/title/title.component';
import { Pressable, ScrollView, Text } from 'util/wrappers/styled-react-native';
import { useMenuItems } from './menu-items';
import { MenuStackParamList } from './menu-navigation';

type Props = StackScreenProps<MenuStackParamList, 'MenuList'>;

const Menu = ({ navigation }: Props) => {
  const menuItems = useMenuItems();

  return (
    <LayoutComponent noPadding>
      <Title style="ml-8">Menu</Title>
      <ScrollView className="flex h-full flex-col">
        {menuItems.map(item => (
          <Pressable
            className="flex flex-row items-center justify-start border-b-2 border-gray-300 p-4"
            key={item.name}
            onPress={() => {
              item.type === 'link' ? navigation.navigate(item.screen) : item.onPress();
            }}>
            <Text className="text-lg">{item.name}</Text>
            <MonoIcon style="ml-auto" iconName={item.icon} />
          </Pressable>
        ))}
      </ScrollView>
    </LayoutComponent>
  );
};

export default Menu;
