import { Platform } from 'react-native';

export type ActionStatus = 'Init' | 'Stepping';

export const getApi = (protocoll: 'ws' | 'http'): string => {
  const localIp = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

  return `${protocoll}://${localIp}:8080/mpc/ecdsa`;
};
