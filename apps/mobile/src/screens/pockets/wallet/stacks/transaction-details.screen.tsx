import { StackScreenProps } from '@react-navigation/stack';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { useState } from 'react';
import { PocketsStackParamList } from 'screens/pockets/pockets-navigation';
import { getPeerOfTransaction } from 'utils/crypto/bitcoin-transaction-utils';
import { getNetValueFromTransaction, getTxFee, toBitcoin } from 'utils/crypto/bitcoin-value';
import { shortenAddress } from 'utils/string';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<PocketsStackParamList, 'TransactionDetails'>;

const TransactionDetailsScreen = ({ navigation, route }: Props) => {
  const { transaction } = route.params;
  const [showMore, setShowMore] = useState<boolean>(false);

  const value = getNetValueFromTransaction(
    transaction,
    transaction.address.address,
    transaction.address.address
  );
  const peer = getPeerOfTransaction(
    transaction,
    transaction.address.address,
    transaction.address.address
  );
  const fee = getTxFee(transaction);

  const getFormattedDate = (timeInEpoch: number) => {
    var date = new Date(0);
    date.setUTCSeconds(timeInEpoch);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const minute = date.getHours();
    const seconds = date.getSeconds();

    return `${day}.${month}.${year} ${minute}:${seconds}`;
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5 pt-12">
        <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
          {transaction.incomming ? 'Received' : 'Sent'}
        </Text>
        <Text className="font-manrope text-sm font-bold text-grey">
          {getFormattedDate(transaction.time)}
        </Text>
        <View className="mb-10 mt-6 border-b-[1.5px] border-[#F6F7F8]" />
        <View className="items-center">
          {transaction.incomming ? (
            <View>
              <PriceTextComponent
                style="text-center font-[system] text-[32px] font-[700] leading-[32px] text-[#01DC0A]"
                bitcoinAmount={toBitcoin(value)}
              />
              <Text className="text-center font-manrope text-sm font-bold text-grey">
                +{toBitcoin(value)} BTC
              </Text>
            </View>
          ) : (
            <View>
              <PriceTextComponent
                style="text-center font-[system] text-[32px] font-[700] leading-[32px] text-[#FF000F]"
                bitcoinAmount={toBitcoin(value)}
              />
              <Text className="font-manrope text-sm font-bold text-grey">
                {toBitcoin(value)} BTC
              </Text>
            </View>
          )}
        </View>
        <View className="mb-10 mt-10 border-b-[1.5px] border-[#F6F7F8]" />
        <View>
          <Text className="font-manrope text-lg font-bold">Overview</Text>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="font-manrope text-xs font-bold text-grey">
              {transaction.incomming ? 'FROM' : 'TO'}
            </Text>
            <View className="items-end">
              <Text className="mt-0.5 rounded bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium text-xs text-grey">
                {shortenAddress(peer)}
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="font-manrope text-xs font-bold text-grey">DATE</Text>
            <Text className="font-manrope text-sm font-bold">
              {getFormattedDate(transaction.time)}
            </Text>
          </View>
          {!transaction.incomming && (
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">NETWORK FEES</Text>
              <PriceTextComponent
                style="font-manrope text-sm font-bold"
                bitcoinAmount={toBitcoin(fee)}
              />
            </View>
          )}
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="font-manrope text-xs font-bold text-grey">NETWORK</Text>
            <Text className="font-manrope text-sm font-bold">Bitcoin</Text>
          </View>
          <Pressable
            className="mt-4 flex-row items-center justify-end"
            onPress={() => setShowMore(!showMore)}>
            <Text className="font-manrope text-sm font-bold text-[#0AAFFF]">
              {showMore ? 'Show less' : 'Show more'}
            </Text>
          </Pressable>
          {showMore && (
            <View>
              <View className="mt-4 flex-row items-center justify-between">
                <Text className="font-manrope text-xs font-bold text-grey">HASH</Text>
                <View className="items-end">
                  <Text className="mt-0.5 rounded bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium text-xs text-grey">
                    {shortenAddress(transaction.hash)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <View className="mb-10 mt-6 border-b-[1.5px] border-[#F6F7F8]" />
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetailsScreen;
