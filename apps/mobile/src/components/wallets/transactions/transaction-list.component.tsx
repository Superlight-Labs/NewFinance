import { AccountTransaction } from 'state/bitcoin.state';
import { FlatList, Text, View } from 'utils/wrappers/styled-react-native';
import Transaction from './transaction.component';

type Props = {
  transactions: AccountTransaction[];
  address: string;
  changeAddress: string;
  loading: boolean;
  onItemPressed: (transaction: AccountTransaction) => void;
};

const TransactionList = ({
  transactions,
  loading,
  address,
  changeAddress,
  onItemPressed,
}: Props) => {
  return (
    <View className="mt-6 flex w-full flex-1 flex-col px-5">
      {!loading && transactions.length !== 0 && (
        <FlatList
          scrollEnabled={false}
          className="flex-12 mb-8"
          keyExtractor={item => item.hash}
          data={transactions}
          renderItem={({ item }: any) => {
            const help = item as AccountTransaction;

            return (
              <Transaction
                key={help.hash}
                address={address}
                changeAddress={changeAddress}
                transaction={help}
                onPress={() => onItemPressed(help)}
              />
            );
          }}
        />
      )}
      {transactions.length === 0 && (
        <View className="flex justify-center">
          <Text className=" font-manrope-semibold text-xs text-grey">No transactions yet...</Text>
        </View>
      )}
    </View>
  );
};

export default TransactionList;
