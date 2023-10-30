import { AddressInfoRequest } from '@superlight-labs/api/src/routes/blockchain.routes';
import { BlockchainResult } from '@superlight-labs/api/src/service/data/blockchain.service';
import { BitcoinBalance, BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import { useState } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { backend } from 'utils/superlight-api';
export const useUpdateWalletData = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { network, updateBalance, setTransactions, addresses } = useBitcoinState();

  return {
    refreshing,
    update: (account: string) => {
      setRefreshing(true);
      let loadBalance = true;
      let loadTransactions = true;

      const allAddresses = [...addresses]
        .flatMap(([_, address]) => [address.get(0)?.address, address.get(1)?.address])
        .filter((address): address is string => !!address);

      const addrInfoRequest: Partial<AddressInfoRequest> = {
        addresses: allAddresses,
        network,
      };

      // TODO: errors are not reflected in snackbar yet https://github.com/Superlight-Labs/NewFinance/issues/44
      backend
        .post<BlockchainResult<BitcoinBalance>>('/blockchain/balance', addrInfoRequest)
        .then(balances => {
          Object.entries(balances.data).forEach(([address, balance]) => {
            updateBalance(balance, account, address);
          });
          loadBalance = false;
          setRefreshing(loadBalance || loadTransactions);
        });

      const query = new URLSearchParams({
        pageSize: '50',
        offset: '0',
      });

      backend
        .post<BlockchainResult<BitcoinTransaction[]>>(
          `/blockchain/transactions?${query.toString()}`,
          addrInfoRequest
        )
        .then(t => {
          Object.entries(t.data).forEach(([address, transactions]) => {
            setTransactions(transactions, account, address);
          });

          loadTransactions = false;
          setRefreshing(loadBalance || loadTransactions);
        });
    },
  };
};
