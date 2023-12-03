import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { Account } from 'state/bitcoin.state';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  navigate: () => void;
  name: string;
  account: Account;
};

const WalletItem = ({ name, navigate, account }: Props) => {
  return (
    <Pressable
      onPress={navigate}
      className="mb-4 flex aspect-[1] h-56 w-[48%]  justify-between rounded-md bg-[#F8F8F8] px-5 py-5 transition-all active:opacity-95">
      <View className="flex-row justify-between ">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          <Text>{account.icon}</Text>
        </View>
      </View>
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="font-manrope text-base font-bold">{name}</Text>
          <PriceTextComponent
            bitcoinAmount={0}
            style="font-manrope text-base font-bold text-[#636360]"
          />
        </View>
        <View className="mb-1">
          <MonoIcon iconName="ArrowRight" height={16} width={16} />
        </View>
      </View>
    </Pressable>
  );
};

export default WalletItem;
