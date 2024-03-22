import { StackScreenProps } from '@react-navigation/stack';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineTextComponent from 'components/shared/input/multiline-text/multiline-text.component';
import WalletSelectorComponent from 'components/shared/input/wallet-selector/wallet-selector.component';
import Numpad from 'components/shared/numpad/numpad.component';
import useBitcoinPrice from 'hooks/useBitcoinData';
import { useState } from 'react';
import { currencyItems } from 'screens/menu/pages/currency-settings.screen';
import { SendStackList } from 'screens/pockets/pockets-navigation';
import { useBitcoinState } from 'state/bitcoin.state';
import { useGeneralState } from 'state/general.state';
import { toSatoshi } from 'utils/crypto/bitcoin-value';
import { Pressable, SafeAreaView, Text, View } from 'utils/wrappers/styled-react-native';

type Props = StackScreenProps<SendStackList, 'SendAmount'>;

const SendScreen = ({ navigation, route }: Props) => {
  const { sender } = route.params;
  const [amount, setAmount] = useState('0');
  const { getAccountBalance } = useBitcoinState();
  const { currency, setCurrency } = useGeneralState();
  const { getPrice } = useBitcoinPrice();
  const [errorBalance, setErrorBalance] = useState(false);
  const balance = getAccountBalance(sender.account);

  const changeCurrency = () => {
    const enabledCurrencyItems = currencyItems.filter(item => item.disabled === false);
    const currentIndex = enabledCurrencyItems.findIndex(data => data.value === currency);
    const nextIndex = (currentIndex + 1) % enabledCurrencyItems.length;
    setCurrency(enabledCurrencyItems[nextIndex].value);
  };

  const toCurrentCurrency = (valueInBTC: number) => {
    if (currency === 'sats') return toSatoshi(valueInBTC);
    else return valueInBTC * getPrice(currency);
  };

  const setAmountToSend = (amount: string) => {
    if (parseFloat(amount) > balance * getPrice(currency)) setErrorBalance(true);
    else setErrorBalance(false);
    if (currency === 'BTC' || currency === 'sats' || (amount.split('.')[1] || '').length <= 2)
      setAmount(amount);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="mx-5 h-full flex-col justify-between">
        <View className="mt-16 flex flex-grow flex-col items-center ">
          <View className="flex w-full flex-row flex-wrap items-center justify-center space-x-1">
            <MultilineTextComponent
              style="border-0 m-w-[100%]  flex font-manrope text-[40px] font-bold leading-[1] shadow-none px-0 bg-white"
              value={amount}
              keyboardType="numeric"
              maxLength={10}
              setValue={setAmountToSend}
              disabled={true}
              onPressIn={changeCurrency}
            />
            <Pressable onPress={changeCurrency}>
              <Text
                className="font-manrope text-[40px] font-bold leading-[46px]"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ lineHeight: 56 }}>
                {currency}
              </Text>
            </Pressable>
          </View>
          <View className="flex-col items-center space-y-3">
            {errorBalance ? (
              <Text className=" font-manrope text-xs font-semibold text-[#FF000F]">
                Balance too low
              </Text>
            ) : (
              <Text className="font-manrope text-xs font-semibold">Enter amount to send</Text>
            )}
          </View>
        </View>
        <View className="mb-6">
          <WalletSelectorComponent disabled selectedWallet={() => {}} />
        </View>
        <Numpad style="mb-6" maxLength={10} value={amount} setValue={setAmountToSend} />
        <ButtonComponent
          disabled={
            Number.isNaN(parseFloat(amount)) ||
            parseFloat(amount) <= 0 ||
            !balance ||
            parseFloat(amount) > toCurrentCurrency(balance)
          }
          style=""
          onPress={() =>
            navigation.navigate('SendTo', { amount: parseFloat(amount), currency, ...route.params })
          }>
          Next
        </ButtonComponent>
      </View>
    </SafeAreaView>
  );
};

export default SendScreen;
