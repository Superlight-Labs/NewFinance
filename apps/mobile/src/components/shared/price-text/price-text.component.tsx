import { useQuery } from '@tanstack/react-query';
import { styled } from 'nativewind';
import { currencyItems } from 'screens/menu/pages/currency-settings.screen';
import { useBitcoinState } from 'state/bitcoin.state';
import { useGeneralState } from 'state/general.state';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { formatCurrency } from 'utils/format/format';
import { backend } from 'utils/superlight-api';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  bitcoinAmount: number;
  style?: string;
  disabled?: boolean;
};

const PriceText = ({ bitcoinAmount = 0, style, disabled = false }: Props) => {
  const { currency, setCurrency } = useGeneralState();
  const { network } = useBitcoinState();

  const { data: currentExchangeRate } = useQuery(
    ['exchangeRate'],
    () =>
      backend
        .post<any>('/blockchain/exchange-rate', {
          network,
        })
        .then(res => res.data),
    { retry: false, refetchInterval: 15000 }
  );

  const changeCurrency = () => {
    const enabledCurrencyItems = currencyItems.filter(item => item.disabled === false);
    const currentIndex = enabledCurrencyItems.findIndex(data => data.value === currency);
    const nextIndex = (currentIndex + 1) % enabledCurrencyItems.length;
    setCurrency(enabledCurrencyItems[nextIndex].value);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={changeCurrency}
      className="group transition-all active:opacity-70">
      <Text className={`font-manrope text-[40px] font-bold leading-[42px] text-black  ${style}`}>
        {currentExchangeRate &&
          formatCurrency(
            currency === 'sats'
              ? toSatoshi(bitcoinAmount)
              : currency === 'BTC'
              ? bitcoinAmount
              : bitcoinAmount * currentExchangeRate.value,
            currencyItems.find(data => data.value === currency)!.value
          )}
      </Text>
    </Pressable>
  );
};

export default styled(PriceText);
