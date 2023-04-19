import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { getNetValueFromTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { truncate } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  transaction: BitcoinTransaction;
  address: string;
  incomming: boolean;
};

const Transaction = ({ transaction, address, incomming }: Props) => {
  return (
    <View className="flex w-full flex-row items-center rounded-lg bg-slate-100 p-4">
      <View className="flex items-center justify-center rounded-lg bg-slate-900 p-4">
        {incomming ? (
          <MonoIcon color="white" iconName="ArrowDownCircle" />
        ) : (
          <MonoIcon color="white" iconName="Send" />
        )}
      </View>
      <View className="ml-4 flex flex-col justify-around">
        <Text className="mb-2 w-36">{truncate(transaction.outputs[1].address, 12)}</Text>

        <Text>{new Date(transaction.time * 1000).toLocaleDateString()}</Text>
      </View>
      <View className="ml-auto">
        <Text>
          {(incomming ? '+' : '-') + getNetValueFromTransaction(transaction, address)} sats
        </Text>
      </View>
    </View>
  );
};

export default Transaction;
