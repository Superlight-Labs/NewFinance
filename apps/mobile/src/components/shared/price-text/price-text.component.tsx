import useBitcoinPrice from 'hooks/useBitcoinData';
import { styled } from 'nativewind';
import { useEffect } from 'react';
import { currencyItems } from 'screens/menu/pages/currency-settings.screen';
import { useGeneralState } from 'state/general.state';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { formatCurrency } from 'utils/format/format';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type Props = {
  bitcoinAmount: number;
  style?: string;
  disabled?: boolean;
};

const PriceText = ({ bitcoinAmount = 0, style, disabled = false }: Props) => {
  const { currency, setCurrency } = useGeneralState();
  const { currentPrices, updateBitcoinPrice, isLoading } = useBitcoinPrice();

  const changeCurrency = () => {
    const enabledCurrencyItems = currencyItems.filter(item => item.disabled === false);
    const currentIndex = enabledCurrencyItems.findIndex(data => data.value === currency);
    const nextIndex = (currentIndex + 1) % enabledCurrencyItems.length;
    setCurrency(enabledCurrencyItems[nextIndex].value);
  };

  useEffect(() => {
    updateBitcoinPrice();
  }, []);

  return (
    <Pressable
      disabled={disabled}
      onPress={changeCurrency}
      className="group transition-all active:opacity-70">
      <Text className={`font-manrope text-[40px] font-bold leading-[42px] text-black  ${style}`}>
        {formatCurrency(
          currency === 'sats' ? toSatoshi(bitcoinAmount) : bitcoinAmount * currentPrices[currency],
          currencyItems.find(data => data.value === currency)!.value
        )}
      </Text>
    </Pressable>
  );
};

export default styled(PriceText);
