import { StackScreenProps } from '@react-navigation/stack';
import { BitcoinProviderEnum, BitcoinService } from '@superlight-labs/blockchain-api-client';
import ButtonComponent from 'components/shared/input/button/button.component';
import MultilineTextComponent from 'components/shared/input/multiline-text/multiline-text.component';
import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import Numpad from 'components/shared/numpad/numpad.component';
import { useDebounce } from 'hooks/useDebounced';
import { useEffect, useRef, useState } from 'react';
import WalletLayout from 'screens/wallet/wallet-layout.component';
import { useBitcoinState } from 'state/bitcoin.state.';
import { getSizeFromLength } from 'utils/string';
import { Text, View } from 'utils/wrappers/styled-react-native';
import { WalletStackList } from '../wallet-navigation';

type Props = StackScreenProps<WalletStackList, 'SendAmount'>;

const SendAmountScreen = ({ navigation, route }: Props) => {
  const [amount, setAmount] = useState('0');
  const [rate, setRate] = useState(0);
  const [loadRate, setLoadRate] = useState(false);
  const {
    network,
    indexAddress: { balance },
  } = useBitcoinState();
  const debouncedAmount = useDebounce(amount, 5000);
  const bitcoinService = useRef(new BitcoinService(network));

  useEffect(() => {
    setLoadRate(true);
    bitcoinService.current.getExchangeRate(BitcoinProviderEnum.TATUM).then(res => {
      setLoadRate(false);
      setRate(parseFloat(res.value));
    });
  }, [debouncedAmount]);

  const numericAmount = parseFloat(amount);
  const textSize = getSizeFromLength(amount.length);

  return (
    <WalletLayout style="p-4" leftHeader="back" rightHeader="none">
      <View className="flex flex-1 flex-col items-center">
        {balance && (
          <View className="flex flex-row items-center justify-center">
            <Text>Available: {balance.incoming - balance.outgoing} BTC</Text>
          </View>
        )}
        <View className="flex w-full flex-1 flex-row flex-wrap items-center justify-center p-2">
          <MultilineTextComponent
            style={`border-0 m-w-[60%] flex m-h-48 font-extrabold shadow-none bg-white ${textSize}`}
            value={amount}
            keyboardType="numeric"
            maxLength={12}
            setValue={setAmount}
          />
          <Text className="p-1 text-6xl font-extrabold">BTC</Text>
          {numericAmount > 0 && (
            <View className="flex w-[100%] flex-row items-center justify-center">
              <Text>~ ${(numericAmount * rate).toFixed(2)} €</Text>
              {loadRate && <MonoIcon width={12} height={12} iconName="Loading" />}
            </View>
          )}
        </View>
      </View>
      <Numpad maxLength={12} value={amount} setValue={setAmount} />
      <ButtonComponent
        shadow
        disabled={
          Number.isNaN(numericAmount) ||
          numericAmount <= 0 ||
          !balance ||
          (!__DEV__ && numericAmount > balance.incoming - balance.outgoing)
        }
        style=" mt-auto mb-8 rounded-lg"
        onPress={() => navigation.navigate('SendReview', { amount, rate, ...route.params })}>
        Continue
      </ButtonComponent>
    </WalletLayout>
  );
};

export default SendAmountScreen;
