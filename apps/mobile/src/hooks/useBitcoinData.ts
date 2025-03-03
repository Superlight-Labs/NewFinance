import { useState } from 'react';
import { useGeneralState } from 'state/general.state';
import { toBitcoin } from 'utils/crypto/bitcoin-value';

const BITCOIN_API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp%2Ceur%2Cusd%2Cchf&precision=2';

const useBitcoinPrice = () => {
  const { currentPrices, setCurrentPrices } = useGeneralState();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const { currency } = useGeneralState();
  const fetchBitcoinPrice = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(BITCOIN_API_URL);
      const data = await response.json();

      setCurrentPrices({
        '€': data.bitcoin.eur,
        $: data.bitcoin.usd,
        '£': data.bitcoin.gbp,
        CHF: data.bitcoin.chf,
        BTC: 1,
        sats: 100000000,
      });
      setLastUpdated(Date.now());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Bitcoin price', error);
      setIsLoading(false);
    }
  };

  const updateBitcoinPrice = () => {
    const currentTime = Date.now();
    const shouldFetch = !lastUpdated || currentTime - lastUpdated > 10000;
    if (shouldFetch) {
      fetchBitcoinPrice();
    }
  };

  const getPrice = (usedCurrency: Currency = 'BTC') => {
    return currentPrices[usedCurrency ? usedCurrency : currency.toLowerCase()] || 0;
  };

  const getPriceFromSatoshis = (sats: number) => {
    return toBitcoin(sats) * currentPrices[currency.toLowerCase()];
  };

  return { currentPrices, isLoading, updateBitcoinPrice, getPrice, getPriceFromSatoshis };
};

export default useBitcoinPrice;
