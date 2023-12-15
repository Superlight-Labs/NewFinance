import { AddressInfoRequest } from '@superlight-labs/api/src/routes/blockchain.routes';
import { BlockchainResult } from '@superlight-labs/api/src/service/data/blockchain.service';
import { BitcoinBalance, BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useBitcoinState } from 'state/bitcoin.state';
import { backend } from 'utils/superlight-api';

// TODO: errors are not reflected in snackbar yet https://github.com/Superlight-Labs/NewFinance/issues/44
export const useUpdateWalletData = () => {
  const [fetch, setFetch] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const { network, updateBalance, setTransactions, addresses } = useBitcoinState();

  const allAddresses = [...addresses]
    .flatMap(([_, address]) => [address.get(0)?.address, address.get(1)?.address])
    .filter((address): address is string => !!address);

  const request: Partial<AddressInfoRequest> = {
    addresses: allAddresses,
    network,
  };

  const {
    data: balances,
    isLoading: balancesLoading,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ['bitcoin', 'balance', account],
    queryFn: () =>
      backend
        .post<BlockchainResult<BitcoinBalance>>('/blockchain/balance', request)
        .then(res => res.data),
    enabled: fetch,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['bitcoin', 'transactions', account],
    queryFn: () =>
      backend
        .post<BlockchainResult<BitcoinTransaction[]>>(`/blockchain/transactions`, request)
        .then(res => res.data),
    enabled: fetch,
  });

  if (balances && transactions && request && account && fetch) {
    Object.entries(balances).forEach(([address, balance]) => {
      updateBalance(balance, account, address);
    });

    Object.entries(transactions).forEach(([address, newTransactions]) => {
      setTransactions(newTransactions, account, address);
    });

    setFetch(false);
  }

  console.log({ balancesLoading, transactionsLoading, fetch });

  return {
    refreshing: fetch,
    update: (fetchAccount: string) => {
      setFetch(true);
      setAccount(fetchAccount);
      refetchBalance();
      refetchTransactions();
    },
  };
};
