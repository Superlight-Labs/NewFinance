import useBitcoinPrice from 'hooks/useBitcoinData';
import { styled } from 'nativewind';
import { useGeneralState } from 'state/general.state';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { formatCurrency } from 'utils/format/format';
import { Pressable, Text } from 'utils/wrappers/styled-react-native';

type CurrencyData = {
  currency: Currency;
};

type Props = {
  bitcoinAmount: number;
  style?: string;
  disabled?: boolean;
};

const currencies: CurrencyData[] = [
  { currency: 'BTC' },
  { currency: 'sats' },
  { currency: '€' },
  { currency: '$' },
  { currency: '£' },
  { currency: 'CHF' },
];

const PriceText = ({ bitcoinAmount = 0, style, disabled = false }: Props) => {
  const { currency, setCurrency } = useGeneralState();
  const { currentPrices } = useBitcoinPrice();

  const changeCurrency = () => {
    const currentIndex = currencies.findIndex(data => data.currency === currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex].currency);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={changeCurrency}
      className="group transition-all active:opacity-70">
      <Text className={`font-manrope text-[40px] font-bold leading-[42px] text-black  ${style}`}>
        {formatCurrency(
          currency === 'sats' ? toSatoshi(bitcoinAmount) : bitcoinAmount * currentPrices[currency],
          currencies.find(data => data.currency === currency)!.currency
        )}
      </Text>
    </Pressable>
  );
};

export default styled(PriceText);
