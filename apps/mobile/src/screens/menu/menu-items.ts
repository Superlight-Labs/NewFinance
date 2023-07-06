import { IconName } from 'components/shared/mono-icon/mono-icon.component';
import { useDeleteLocalData } from 'hooks/useDeleteLocalData';
import { openWebsite, reportBugUrl } from 'utils/web-opener';
import { MenuStackParamList } from './menu-navigation';

type MenuCategory = {
  name: string;
  items: MenuItem[];
};

type MenuItem = {
  name: string;
  subText: string;
  icon: IconName;
} & (ActionItem | LinkItem);

type ActionItem = {
  type: 'action';
  onPress: () => void;
};

type LinkItem = {
  type: 'link';
  screen: keyof MenuStackParamList;
};

const homePageUrl = 'https://www.superlight.me/';

export const useMenuItems = () => {
  const { deleteLocalData: logout } = useDeleteLocalData();

  const generalItems: MenuItem[] = [
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

  const aboutItems: MenuItem[] = [
    {
      name: 'Homepage',
      subText: 'Visit our homepage',
      type: 'action',
      icon: 'ExternalLink',
      onPress: () => openWebsite(homePageUrl),
    },
    {
      name: 'Support',
      subText: 'Raise a question or give us feedback',
      type: 'action',
      icon: 'ExternalLink',
      onPress: () => openWebsite(homePageUrl + '/support'),
    },
    {
      name: 'Raise a bug',
      subText: 'Imrpove the app by raising a bug',
      type: 'action',
      icon: 'Github',
      onPress: () => openWebsite(reportBugUrl),
    },
  ];

  const categories: MenuCategory[] = [
    { name: 'General', items: generalItems },
    { name: 'About', items: aboutItems },
  ];

  return categories;
};
