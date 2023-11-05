import { useEffect, useState } from 'react';

const BITCOIN_API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp%2Ceur%2Cusd%2Cchf&precision=2';

const useBitcoinPrice = (currency = '$') => {
  const [price, setPrice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    let throttleTimer: string | number | NodeJS.Timeout | undefined;

    if (currency === 'BTC' || currency === 'sats') {
      setPrice(1);
    } else {
      const fetchBitcoinPrice = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(BITCOIN_API_URL);
          const data = await response.json();
          const eurPrice = data.bitcoin.eur;
          const usdPrice = data.bitcoin.usd;
          const gbpPrice = data.bitcoin.gbp;
          const chfPrice = data.bitcoin.chf;
          if (currency === '€') setPrice(eurPrice);
          else if (currency === '£') setPrice(gbpPrice);
          else if (currency === 'CHF') setPrice(chfPrice);
          else setPrice(usdPrice);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching Bitcoin price', error);
          setIsLoading(false);
        }
      };

      fetchBitcoinPrice();
    }
    /*const triggerFetch = () => {
      if (!isLoading) {
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(fetchBitcoinPrice, 5000);
      }
    };*/

    // Set a timer to refresh the price every 5 seconds
    //timer = setInterval(triggerFetch, 5000);

    // Clear the timers and interval when the component unmounts
    return () => {
      clearInterval(timer);
      clearTimeout(throttleTimer);
    };
  }, [currency]);

  return { price, isLoading };
};

export default useBitcoinPrice;
