import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { AccountTransaction } from 'state/bitcoin.state';
import { getPeerOfTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { getNetValueFromTransaction, getTxFee } from 'utils/crypto/bitcoin-value';
import { shortenAddress } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  transaction: AccountTransaction;
  address: string;
  changeAddress: string;
};

const Transaction = ({ transaction, address, changeAddress }: Props) => {
  const peer = getPeerOfTransaction(transaction, address, changeAddress);
  const value = getNetValueFromTransaction(transaction, address, changeAddress);

  const incomming = value > 0;
  const fee = getTxFee(transaction);

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

        <Text>{new Date(transaction.time).toDateString()}</Text>
      </View>
      <View className="ml-auto">
        {incomming ? (
          <Text>+{value} sats</Text>
        ) : (
          <>
            <Text>{value + fee} sats</Text>
            <Text className=" text-xs">Fees: {getTxFee(transaction)} sats</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Transaction;
