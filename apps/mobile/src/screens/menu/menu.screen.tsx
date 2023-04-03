import { StackScreenProps } from '@react-navigation/stack';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Pressable, ScrollView, Text } from 'util/wrappers/styled-react-native';
import { useMenuItems } from './menu-items';
import { MenuStackParamList } from './menu-navigation';

type Props = StackScreenProps<MenuStackParamList, 'MenuList'>;

const Menu = ({ navigation }: Props) => {
  const menuItems = useMenuItems();

  return (
    <ScrollView className="flex h-full w-full flex-col ">
      {menuItems.map(item => (
        <Pressable
          className="mb-4 flex w-full flex-row items-center justify-start border-y-2 border-gray-200 p-4"
          key={item.name}
          onPress={() => {
            item.type === 'link' ? navigation.navigate(item.screen) : item.onPress();
          }}>
          <Text className="text-lg">{item.name}</Text>
          <MonoIcon style="ml-auto" iconName={item.icon} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Menu;
