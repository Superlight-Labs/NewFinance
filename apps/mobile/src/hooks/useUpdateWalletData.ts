import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import { useRef, useState } from 'react';
import { useBitcoinState } from 'state/bitcoin.state.';

export const useUpdateWalletData = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    network,
    updateBalance,
    setTransactions,
    indexAddress: { address },
  } = useBitcoinState();
  const service = useRef(new BitcoinService(network));

  return {
    refreshing,
    update: () => {
      setRefreshing(true);
      let loadBalance = true;
      let loadTransactions = true;

      service.current.getBalance(address, BitcoinProviderEnum.TATUM).then(fetchedBalance => {
        loadBalance = false;
        updateBalance(fetchedBalance);
        setRefreshing(loadBalance || loadTransactions);
      });

      const query = new URLSearchParams({
        pageSize: '50',
        offset: '0',
      });

      service.current
        .getTransactions(address, query, BitcoinProviderEnum.TATUM)
        .then(fetchedTransactions => {
          loadTransactions = false;
          setTransactions(fetchedTransactions);
          setRefreshing(loadBalance || loadTransactions);
        });
    },
  };
};
