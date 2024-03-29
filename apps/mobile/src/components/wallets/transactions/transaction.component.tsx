import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { AccountTransaction } from 'state/bitcoin.state';
import { getPeerOfTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { getNetValueFromTransaction, getTxFee, toBitcoin } from 'utils/crypto/bitcoin-value';
import { shortenAddress } from 'utils/string';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  transaction: AccountTransaction;
  address: string;
  changeAddress: string;
  onPress?: () => void;
};

const Transaction = ({ onPress, transaction, address, changeAddress }: Props) => {
  const peer = getPeerOfTransaction(transaction, address, changeAddress);
  const value = getNetValueFromTransaction(transaction, address, changeAddress);

  const incomming = value > 0;
  const fee = getTxFee(transaction);

  const getFormattedDate = (timeInEpoch: number) => {
    var date = new Date(0);
    date.setUTCSeconds(Number(timeInEpoch.toString().slice(0, 10)));
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${day}.${month}.`;
  };

  return (
    <Pressable className="flex w-full flex-row" onPress={onPress}>
      <View className="mr-2 mt-1 flex w-8 items-center rounded-lg pb-1">
        {incomming ? (
          <MonoIcon
            color="black"
            width={14}
            height={14}
            strokeWitdth={2.5}
            iconName="ArrowDownToDot"
          />
        ) : (
          <MonoIcon color="black" width={14} height={14} strokeWitdth={2.5} iconName="Send" />
        )}
        <Text className="mt-0.5 text-center font-manrope text-[9px] font-bold text-grey">
          {getFormattedDate(transaction.time)}
        </Text>
      </View>
      <View className="h-full flex-col items-center  pt-2">
        <View className="mb-1 h-[5px] w-[5px] rounded-full bg-[#EBEAEF]" />
        <View className="h-14 w-[1] bg-[#EBEAEF]" />
      </View>
      <View className="ml-4 mt-[1px] pb-1">
        <Text className="font-manrope-bold text-[13px] leading-[18px]">
          {incomming ? 'Received' : 'Sent to'}
        </Text>
        <View className="mt-2 ">
          <Text className="rounded bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium text-[13px] leading-[16px] text-grey">
            {shortenAddress(peer)}
          </Text>
        </View>
      </View>
      <View className="ml-auto">
        {incomming ? (
          <View className="flex-row">
            <Text className="font-manrope-bold text-[13px] leading-[18px] text-[#01DC0A]">+</Text>
            <PriceTextComponent
              style="font-manrope-bold text-[13px] leading-[18px] text-[#01DC0A]"
              bitcoinAmount={toBitcoin(value)}
            />
          </View>
        ) : (
          <View className="flex-col items-end">
            <PriceTextComponent
              style="font-manrope-bold text-[13px] leading-[18px] text-[#FF000F]"
              bitcoinAmount={toBitcoin(value + fee)}
            />
            <View className="mt-2 flex-row">
              <PriceTextComponent
                style="font-manrope font-medium text-[13px] leading-[16px] text-grey"
                bitcoinAmount={toBitcoin(fee)}
              />
              <Text className="font-manrope-medium text-[13px] leading-[16px] text-grey"> fee</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Transaction;
