import { Linking } from 'react-native';

export const reportBugUrl =
  'https://github.com/Superlight-Labs/Superlight/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=';

export const openWebsite = (url = '') => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    }
  });
};
