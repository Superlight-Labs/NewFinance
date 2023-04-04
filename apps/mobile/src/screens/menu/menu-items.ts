import { FeatherIconName } from 'components/shared/mono-icon/mono-icon.component';
import { useAuthState } from 'state/auth.state';
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
  const { logout } = useAuthState();

  const items: MenuItem[] = [
    { name: 'Logout', type: 'action', icon: 'LogOut', onPress: logout },
    { name: 'Bitcoin Settings', type: 'link', icon: 'ChevronRight', screen: 'BitcoinSettings' },
  ];

  return items;
};
