import { FeatherIconName } from 'components/shared/mono-icon/mono-icon.component';
import { useLogout } from 'hooks/useLogout';
import { MenuStackParamList } from './menu-navigation';

type MenuCategory = {
  name: string;
  items: MenuItem[];
};

type MenuItem = {
  name: string;
  subText: string;
  icon: FeatherIconName;
} & (ActionItem | LinkItem);

type ActionItem = {
  type: 'action';
  onPress: () => void;
};

type LinkItem = {
  type: 'link';
  screen: keyof MenuStackParamList;
};

export const useMenuItems = () => {
  const { logout } = useLogout();

  const items: MenuItem[] = [
    {
      name: 'Logout',
      subText: 'Delete your wallet completely',
      type: 'action',
      icon: 'LogOut',
      onPress: logout,
    },
    {
      name: 'Bitcoin Settings',
      subText: 'Change settings specific to Bitcoin',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'BitcoinSettings',
    },
  ];

  const categories: MenuCategory[] = [{ name: 'General', items }];

  return categories;
};
