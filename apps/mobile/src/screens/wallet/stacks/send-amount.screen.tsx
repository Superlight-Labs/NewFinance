import { StackScreenProps } from '@react-navigation/stack';
import { ExchangeRate } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineTextComponent from 'components/shared/input/multiline-text/multiline-text.component';
import Numpad from 'components/shared/numpad/numpad.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useDebounce } from 'hooks/useDebounced';
import { useEffect, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state';
import { useGeneralState } from 'state/general.state';
import { formatCurrency } from 'utils/format/format';
import { backend } from 'utils/superlight-api';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendAmount'>;

type CurrencyData = {
  currency: Currency;
};

const currencies: CurrencyData[] = [
  { currency: 'BTC' },
  { currency: 'sats' },
  { currency: '€' },
  { currency: '$' },
  { currency: '£' },
  { currency: 'CHF' },
];

const SendAmountScreen = ({ navigation, route }: Props) => {
  const { sender } = route.params;
  const [amount, setAmount] = useState('0');
  const [rate, setRate] = useState(0);
  const [loadRate, setLoadRate] = useState(false);
  const { network, getAccountBalance } = useBitcoinState();
  const debouncedAmount = useDebounce(amount, 5000);
  const { currency, setCurrency } = useGeneralState();
  const currencyRate = useBitcoinPrice(currency);

  useEffect(() => {
    setLoadRate(true);
    backend.post<ExchangeRate>('/blockchain/exchange-rate', { network }).then(res => {
      setLoadRate(false);
      setRate(parseFloat(res.data.value));
    });
  }, [debouncedAmount]);

  const changeCurrency = () => {
    const currentIndex = currencies.findIndex(data => data.currency === currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex].currency);
  };

  const toCurrentCurrency = (valueInBTC: number) => {
    return valueInBTC * currencyRate.price;
  };

  const numericAmount = parseFloat(amount);

  const balance = getAccountBalance(sender.account);

  return (
    <WalletLayout leftHeader="copy" style="pb-4">
      <View className="mt-20 flex flex-grow flex-col items-center ">
        <View className="flex w-full flex-row flex-wrap items-center justify-center space-x-1">
          <MultilineTextComponent
            style="border-0 m-w-[100%] flex font-manrope text-[40px] font-bold leading-[1] shadow-none px-0 bg-white"
            value={amount}
            keyboardType="numeric"
            maxLength={10}
            setValue={setAmount}
            disabled={true}
            onPressIn={changeCurrency}
          />
          <Pressable onPress={changeCurrency}>
            <Text
              className="font-manrope text-[40px] font-bold leading-[46px]"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ lineHeight: '46px' }}>
              {currency}
            </Text>
          </Pressable>
        </View>
        <View className="flex-col items-center space-y-3">
          <Text className="font-manrope text-xs font-semibold">Enter amount to send</Text>
          <Text className="font-manrope text-xs font-semibold text-[#0AAFFF]">
            {formatCurrency(balance * currencyRate.price, currency)} available
          </Text>
        </View>
      </View>
      <Numpad style="mb-6" maxLength={10} value={amount} setValue={setAmount} />
      <ButtonComponent
        disabled={
          Number.isNaN(numericAmount) ||
          numericAmount <= 0 ||
          !balance ||
          numericAmount > toCurrentCurrency(balance)
        }
        style=""
        onPress={() => navigation.navigate('SendTo', { amount, rate, currency, ...route.params })}>
        Continue
      </ButtonComponent>
    </WalletLayout>
  );
};

export default SendAmountScreen;
