import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { isIncommingTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { ScrollView, Text, View } from 'utils/wrappers/styled-react-native';
import TransactionSkeleton from './transaction-skeleton.component';
import Transaction from './transaction.component';

type Props = {
  transactions: BitcoinTransaction[];
  address: string;
  loading: boolean;
};

const TransactionList = ({ transactions, loading, address }: Props) => {
  return (
    <View className="flex h-full w-full flex-col px-5">
      <View className="mb-4 flex w-full flex-row justify-between ">
        <Text className=" font-bold">Transactions</Text>
        <MonoIcon color="#5BB5A2" iconName="Search" />
      </View>

      <ScrollView>
        {loading ? (
          <TransactionSkeleton />
        ) : transactions.length === 0 ? (
          <Text>No Transactions yet</Text>
        ) : (
          transactions.map(transaction => (
            <Transaction
              key={transaction.hash}
              address={address}
              incomming={isIncommingTransaction(transaction, transactions)}
              transaction={transaction}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionList;
