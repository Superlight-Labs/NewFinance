import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import { useRef, useState } from 'react';
import { AddressInfo, useBitcoinState } from 'state/bitcoin.state';

export const useUpdateWalletData = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { network, updateBalance, setTransactions, addresses } = useBitcoinState();
  const service = useRef(new BitcoinService(network));

  return {
    refreshing,
    update: () => {
      setRefreshing(true);
      let loadBalance = true;
      let loadTransactions = true;

      const allAddresses = [...addresses]
        .flatMap(([_, address]) => [
          { ...address.get(0), index: 0 },
          { ...address.get(1), index: 1 },
        ])
        .filter((address): address is AddressInfo & { index: number } => !!address);

      Promise.allSettled(
        allAddresses.map(addr =>
          service.current
            .getBalance(addr.address, BitcoinProviderEnum.TATUM)
            .then(balance => updateBalance(balance, addr.account, addr.index))
        )
      ).then(_ => {
        loadBalance = false;
        setRefreshing(loadBalance || loadTransactions);
      });

      const query = new URLSearchParams({
        pageSize: '50',
        offset: '0',
      });

      Promise.allSettled(
        allAddresses.map(addr =>
          service.current
            .getTransactions(addr.address, query, BitcoinProviderEnum.TATUM)
            .then(fetchedTransactions => {
              setTransactions(fetchedTransactions, addr.account, addr.index);
            })
        )
      ).then(_ => {
        loadTransactions = false;
        setRefreshing(loadBalance || loadTransactions);
      });
    },
  };
};
