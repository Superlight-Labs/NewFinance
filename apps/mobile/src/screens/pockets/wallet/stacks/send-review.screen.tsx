import { StackScreenProps } from '@react-navigation/stack';
import {
  BroadCastTransactionBody,
  GetFeesRequest,
} from '@superlight-labs/api/src/routes/blockchain.routes';
import { CreateTransactionRequest } from '@superlight-labs/api/src/routes/transaction.routes';
import { BroadcastTransaction, Fees } from '@superlight-labs/blockchain-api-client';
import Big from 'big.js';
import ButtonComponent from 'components/shared/input/button/button.component';
import { RadioButtonItem } from 'components/shared/input/radio-button/radio-button';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import * as Haptics from 'expo-haptics';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useCreateBitcoinTransaction } from 'hooks/useCreateBitcoinTransaction';
import { useFailableAction } from 'hooks/useFailable';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Switch } from 'react-native';
import { SendStackList } from 'screens/pockets/pockets-navigation';
import { useAuthState } from 'state/auth.state';
import { useBitcoinState } from 'state/bitcoin.state';
import { useSnackbarState } from 'state/snackbar.state';
import { shortenAddress } from 'utils/string';
import { backend } from 'utils/superlight-api';
import { Modal, Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<SendStackList, 'SendReview'>;

const SendReviewScreen = ({
  navigation,
  route: {
    params: { amount, toAddress, sender, contact, note, currency, customFee },
  },
}: Props) => {
  const { user } = useAuthState();
  const { network, addresses, getAccountBalance } = useBitcoinState();
  const [fee, setFee] = useState(customFee ? customFee : 0);
  const [fees, setFees] = useState<RadioButtonItem[]>([{ label: '', value: 0, disabled: false }]);
  const { createTransaction } = useCreateBitcoinTransaction(sender.account);
  const { perform } = useFailableAction();
  const { setMessage } = useSnackbarState();
  const { getPrice } = useBitcoinPrice();
  const [transactionLoading, setTransactionLoading] = useState(false);

  const balance = getAccountBalance(sender.account);
  const total = new Big(amount / getPrice(currency)).add(new Big(fee));
  const amountInBitcoin = Number(new Big(amount / getPrice(currency)).toFixed(8));

  useEffect(() => {
    if (balance < total.toNumber())
      setMessage({
        level: 'error',
        message: 'Insufficient funds',
        error: 'Insufficient funds',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fee, amount]);

  //set customFees
  useEffect(() => {
    setFee(customFee ? customFee : fees[0].value);
  }, [customFee]);

  useEffect(() => {
    refreshFees();
  }, []);

  const refreshFees = () => {
    backend
      .post<Fees>('/blockchain/fees', {
        network,
        from: [...(addresses.get(sender.account) || [])].map(([_, a]) => a.address),
        to: [{ address: toAddress, value: amountInBitcoin }],
      } as Partial<GetFeesRequest>)
      .then(({ data: feeData }) => {
        if (fee === 0) {
          setFee(Number.parseFloat(feeData.medium));
          //setCustomFee((getPrice() * fees.data.medium).toFixed(2).toString());
        }
        setFees([
          {
            label: 'Slow',
            text: '~' + (getPrice() * Number.parseFloat(feeData.slow)).toFixed(2) + currency,
            value: Number.parseFloat(feeData.slow),
            disabled: false,
          },
          {
            label: 'Medium',
            text: '~' + (getPrice() * Number.parseFloat(feeData.medium)).toFixed(2) + currency,
            value: Number.parseFloat(feeData.medium),
            disabled: false,
          },
          {
            label: 'Fast',
            text: '~' + (getPrice() * Number.parseFloat(feeData.fast)).toFixed(2) + currency,
            value: Number.parseFloat(feeData.fast),
            disabled: false,
          },
        ]);
      });
  };

  const createAndSendTransaction = useCallback(() => {
    setTransactionLoading(true);
    setMessage({ level: 'progress', total: 1, step: 1, message: 'Processing Transaction' });
    perform(createTransaction(amountInBitcoin, toAddress, fee)).onSuccess(trans => {
      backend.post('/transaction/create', {
        hash: trans.getId(),
        reciever: {
          address: toAddress,
          name: contact?.name,
        },
        sender: {
          address: sender.address,
          name: user?.username,
          userEmail: user?.email,
        },
        amount: amountInBitcoin,
        note,
      } as CreateTransactionRequest);

      backend
        .post<BroadcastTransaction>('/blockchain/broadcast-transaction', {
          network,
          hash: trans.toHex(),
        } as Partial<BroadCastTransactionBody>)
        .then(_ => {
          setTransactionLoading(false);
          setMessage({ level: 'success', message: 'Transaction sent successfully' });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigation.getParent()?.goBack();
        })
        .catch(error => {
          setTransactionLoading(false);
          setMessage({ level: 'error', error, message: 'Failed to send Transaction' });
        });
    });
  }, [
    contact,
    setMessage,
    perform,
    network,
    navigation,
    createTransaction,
    amount,
    toAddress,
    fee,
    note,
    sender,
    user,
  ]);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="h-full justify-between px-5">
        <View>
          <View className="flex-row">
            <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
              Send{'\xa0'}
            </Text>
            <PriceTextComponent
              disabled={true}
              style="font-[system] text-[32px] font-[700] leading-[32px] text-black"
              bitcoinAmount={+amount / getPrice(currency)}
            />
          </View>
          <View className="flex-row">
            <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-black">
              to{'\xa0'}
            </Text>

            <Text className="font-[system] text-[32px] font-[700] leading-[32px] text-[#0AAFFF]">
              {contact?.name}
            </Text>
          </View>
          <View className="border-1 mt-4 border-b border-[#F6F7F8] pb-4">
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">FROM</Text>
              <Text className="font-manrope text-sm font-bold">Main pocket</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">TO</Text>
              <View className="items-end">
                <Text className="font-manrope text-sm font-bold">{contact?.name}</Text>

                <Text className="mt-0.5 rounded bg-[#F5F5F5] px-1.5 py-0.5 font-manrope-medium text-xs text-grey">
                  {shortenAddress(toAddress)}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">PURPOSE</Text>
              <Text className="font-manrope text-sm font-bold">{note}</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">DATE</Text>
              <Text className="font-manrope text-sm font-bold">Now</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">ROUTE</Text>
              <Text className="font-manrope text-sm font-bold text-[#0AAFFF]">Auto route</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">RECURRING</Text>
              <Switch disabled={true} />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-grey">FEES</Text>
              <Pressable
                className="flex-row items-center rounded active:bg-[#0000000F]"
                onPress={() =>
                  navigation.navigate('ChooseFees', {
                    fees: fees,
                    currency: currency,
                    currentFee: fee,
                  })
                }>
                <PriceTextComponent
                  bitcoinAmount={fee}
                  disabled={true}
                  style="font-manrope text-sm font-bold mr-1"
                />
                <MonoIcon
                  iconName="Settings2"
                  style="mt-0.5"
                  strokeWitdth={3}
                  width={12}
                  height={12}
                />
              </Pressable>
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-manrope text-xs font-bold text-black">TOTAL</Text>
              <PriceTextComponent
                disabled={true}
                style="font-manrope text-sm font-bold"
                bitcoinAmount={total.toNumber()}
              />
            </View>
          </View>
          <View className="mt-6">
            <Text className="font-manrope text-xs font-medium text-grey">
              You send from a Bitcoin pocket - if the receiving account is not a Bitcoin wallet, the
              amount will be lost.
            </Text>
          </View>
        </View>
        <View>
          {balance < total.toNumber() && (
            <View className="mb-3 items-center">
              <Text className="text-center font-manrope text-xs font-medium text-[#FF000F]">
                Insufficient funds when factoring in the network fees.
              </Text>
            </View>
          )}
          <ButtonComponent
            disabled={balance < total.toNumber()}
            onPress={createAndSendTransaction}
            style="">
            Send now
          </ButtonComponent>
        </View>
      </View>
      <Modal
        visible={transactionLoading}
        animationType="fade"
        className="opacity-20"
        presentationStyle="overFullScreen"
        transparent={true}>
        <View className=" h-full w-full items-center justify-center bg-black opacity-50">
          <ActivityIndicator />
          <Text className="mt-3 font-manrope-medium text-sm text-white">
            Processing transaction...
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SendReviewScreen;
