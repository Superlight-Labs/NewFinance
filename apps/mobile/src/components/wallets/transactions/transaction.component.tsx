import { BitcoinTransaction } from '@superlight-labs/blockchain-api-client';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { getPeerOfTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { getNetValueFromTransaction } from 'utils/crypto/bitcoin-value';
import { shortenAddress } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  transaction: BitcoinTransaction;
  address: string;
};

const Transaction = ({ transaction, address }: Props) => {
  const peer = getPeerOfTransaction(transaction, address);
  const value = getNetValueFromTransaction(transaction, address);

  const incomming = value > 0;

  return (
    <View className="mb-2 flex w-full flex-row items-center rounded-lg bg-slate-100 p-4">
      <View className="flex items-center justify-center rounded-lg bg-slate-900 p-4">
        {incomming ? (
          <MonoIcon color="white" iconName="ArrowDownCircle" />
        ) : (
          <MonoIcon color="white" iconName="Send" />
        )}
      </View>
      <View className="ml-4 flex flex-col justify-around">
        <Text className="mb-2 w-36">{shortenAddress(peer)}</Text>

        <Text>{new Date(transaction.time).toLocaleDateString()}</Text>
      </View>
      <View className="ml-auto">
        <Text>{(incomming ? '+' : '') + value} sats</Text>
      </View>
    </View>
  );
};

export default Transaction;
