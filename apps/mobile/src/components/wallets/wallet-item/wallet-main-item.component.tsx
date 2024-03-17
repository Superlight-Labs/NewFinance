import { useQuery } from '@tanstack/react-query';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Clipboard } from 'react-native';
import { DataItem } from 'src/types/chart';
import { useAuthState } from 'state/auth.state';
import { Performance, useBitcoinState } from 'state/bitcoin.state';
import { useSnackbarState } from 'state/snackbar.state';
import { shortenAddress } from 'utils/string';
import { backend, historyApi } from 'utils/superlight-api';
import { ImageBackground, Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  account: string;
  balance: number;
  disabled?: boolean;
  navigate: () => void;
};

const emptyPerformance = {
  percentage: 0,
  absolute: 0,
  average: 0,
};

const WalletMainItem = ({ account, balance, navigate, disabled = false }: Props) => {
  const { setMessage } = useSnackbarState();
  const { user } = useAuthState();
  const { getAccountAddresses, network, getAccountPerformance } = useBitcoinState();
  const [accountPerformance, setAccountPerformance] = useState<Performance>(emptyPerformance);

  const isUp = (value: number) => {
    return value >= 0;
  };

  const addresses = getAccountAddresses(account);

  const { external } = addresses;

  const { data: currentExchangeRate } = useQuery(
    ['exchangeRate'],
    () =>
      backend
        .post<any>('/blockchain/exchange-rate', {
          network,
        })
        .then(res => res.data),
    { retry: false, refetchInterval: 30000 }
  );

  const { data: historyDataTotal } = useQuery(
    ['historyData', 'total'],
    () => historyApi.get<DataItem[]>('/total').then(res => res.data),
    { retry: false }
  );

  const copyToClipboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Clipboard.setString(external.address);
    setMessage({ level: 'info', message: 'Copied your Address to clipboard' });
  };

  useEffect(() => {
    if (historyDataTotal !== undefined && currentExchangeRate !== undefined)
      setAccountPerformance(
        getAccountPerformance('Main pocket', currentExchangeRate.value, historyDataTotal)
      );
  }, [historyDataTotal, currentExchangeRate]);

  return (
    <Pressable
      className={` transition-all  ${!disabled ? 'active:opacity-95' : ''}`}
      onPress={navigate}>
      <ImageBackground
        source={require('../../../../assets/images/pockets/pocket_main.png')}
        resizeMode="contain"
        className="h-[240px] w-full">
        <View className="h-full">
          <View className="h-[165px]  justify-end px-5 pb-4 pt-8">
            <PriceTextComponent
              style="font-manrope text-3xl font-bold text-[#131313]"
              disabled={true}
              bitcoinAmount={balance}
            />
            <View className="w-full flex-row justify-between">
              <View className="flex-row items-center">
                {isUp(accountPerformance.absolute) ? (
                  <MonoIcon
                    iconName="ChevronsUp"
                    width={16}
                    height={16}
                    strokeWitdth={3}
                    color={'#01DC0A'}
                  />
                ) : (
                  <MonoIcon
                    iconName="ChevronsDown"
                    width={16}
                    height={16}
                    strokeWitdth={3}
                    color={'#FF3F32'}
                  />
                )}

                <Text
                  className="font-manrope text-sm font-bold text-[#01DC0A]"
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ color: isUp(accountPerformance.absolute) ? '#01DC0A' : '#FF3F32' }}>
                  {accountPerformance.absolute.toFixed(2)}€ (
                  {accountPerformance.percentage.toFixed(2)}
                  %)
                </Text>
              </View>
              <Pressable
                onPress={() => copyToClipboard()}
                className="flex-row items-center justify-center rounded-lg bg-[#F0F0F0AA] px-1.5 py-0.5 ">
                <Text className="mr-1 font-manrope-medium text-xs text-[#131313]">
                  {shortenAddress(external.address)}
                </Text>
                <MonoIcon
                  iconName="Copy"
                  width={10}
                  height={10}
                  strokeWitdth={2}
                  color={'#131313'}
                />
              </Pressable>
            </View>
          </View>
          <View className="h-[74px] justify-center px-6">
            <Text className="font-manrope text-sm font-semibold text-white">Bitcoin only</Text>
            <Text className="mt-1 font-manrope text-sm font-semibold text-white">
              @{user?.username}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default WalletMainItem;
