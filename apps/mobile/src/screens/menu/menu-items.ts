import { IconName } from 'components/shared/mono-icon/mono-icon.component';
import { useDeleteLocalData } from 'hooks/useDeleteLocalData';
import { useAuthState } from 'state/auth.state';
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
} & (ActionItem | LinkItem | SwitchItem);

type SwitchItem = {
  type: 'switch';
  onPress: () => void;
  onValueChange: (value: any) => void;
  value: boolean;
};

type ActionItem = {
  type: 'action';
  onPress: () => void;
};

type LinkItem = {
  type: 'link';
  screen: keyof MenuStackParamList;
};

const homePageUrl = 'https://www.getnewfinance.com/';

export const useMenuItems = () => {
  const { deleteLocalData: logout } = useDeleteLocalData();
  const { user } = useAuthState();

  const contactItems: MenuItem[] = [
    {
      name: 'E-Mail',
      subText: user?.email!,
      type: 'link',
      icon: 'ChevronRight',
      screen: 'EmailSettings',
    },
    {
      name: 'Tag',
      subText: user?.username!,
      type: 'link',
      icon: 'ChevronRight',
      screen: 'TagSettings',
    },
    {
      name: 'ENS/BNS name',
      subText: user?.username! + '@newfinance',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'ENSSettings',
    },
  ];

  const generalItems: MenuItem[] = [
    {
      name: 'Network',
      subText: 'Change the Bitcoin network',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'BitcoinSettings',
    },
    {
      name: 'Local currency',
      subText: 'Change the displayed currency',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'CurrencySettings',
    },
  ];

  const safetyItems: MenuItem[] = [
    {
      name: 'Face ID',
      subText: 'Use Face ID to unlock',
      type: 'switch',
      icon: 'ChevronRight',
      onPress: () => {},
      onValueChange: () => {},
      value: true,
    },
    {
      name: 'Backup',
      subText: 'Backup your wallet',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'BackupSettings',
    },
    {
      name: 'Seed phrase',
      subText: '**** **** **** ****',
      type: 'link',
      icon: 'ChevronRight',
      screen: 'SeedphraseSettings',
    },
  ];

  const serviceItems: MenuItem[] = [
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
      subText: 'Improve the app by raising a bug',
      type: 'action',
      icon: 'Github',
      onPress: () => openWebsite(reportBugUrl),
    },
  ];

  const devOnlyItems: MenuItem[] = [
    {
      name: 'Logout',
      subText: 'Delete your wallet completely',
      type: 'action',
      icon: 'LogOut',
      onPress: logout,
    },
  ];

  const categories: MenuCategory[] = [
    { name: 'Contact', items: contactItems },
    { name: 'App settings', items: generalItems },
    { name: 'Safety', items: safetyItems },
    { name: 'Service', items: serviceItems },
    ...(process.env.NODE_ENV === 'development' ? [{ name: 'Dev only', items: devOnlyItems }] : []),
  ];

  return categories;
};
