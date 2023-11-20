import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { styled } from 'nativewind';
import { useBitcoinState } from 'state/bitcoin.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  disabled?: boolean;
  onPress?: () => void;
  style?: string;
  selectedWallet: (wallet: any) => void;
};

const WalletSelector = ({ disabled, onPress, style }: Props) => {
  const { accounts, getAccountBalance } = useBitcoinState();
  return (
    <>
      {[...accounts].map(account => (
        <Pressable
          disabled={disabled}
          onPress={onPress}
          className={`w-full flex-row items-center justify-between rounded border-[1px] border-[#eeeeee] px-6 py-3 ${style}`}>
          <View>
            <Text className="font-manrope text-sm font-bold">{account[0]}</Text>
            <PriceTextComponent
              style="font-manrope font-bold text-sm text-grey"
              bitcoinAmount={getAccountBalance(account[0])}
            />
          </View>
          <MonoIcon iconName="ChevronDown" />
        </Pressable>
      ))}
    </>
  );
};

export default styled(WalletSelector);
