import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
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
    <View className="flex w-full flex-1 flex-col px-5">
      <View className="mb-4 flex w-full flex-row justify-between ">
        <Text className=" font-bold">Transactions</Text>
        <MonoIcon color="#5BB5A2" iconName="Search" />
      </View>

      <ScrollView className="flex-12 mb-8">
        {loading ? (
          <TransactionSkeleton />
        ) : transactions.length === 0 ? (
          <Text>No Transactions yet</Text>
        ) : (
          transactions.map(transaction => (
            <Transaction key={transaction.hash} address={address} transaction={transaction} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionList;
