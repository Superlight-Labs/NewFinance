import { FeatherIconName } from 'components/shared/mono-icon/mono-icon.component';
import { useLogout } from 'hooks/useLogout';
import { MenuStackParamList } from './menu-navigation';

type MenuItem = {
  name: string;
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
    { name: 'Logout', type: 'action', icon: 'LogOut', onPress: logout },
    { name: 'Bitcoin Settings', type: 'link', icon: 'ChevronRight', screen: 'BitcoinSettings' },
  ];

  return items;
};
