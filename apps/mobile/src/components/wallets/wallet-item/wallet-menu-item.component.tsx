import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { Pressable, Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
  balance: number;
  navigate: () => void;
};

const WalletMenuItem = ({ name, balance, navigate }: Props) => {
  return (
    <Pressable
      className="mb-5 aspect-[1] h-56 w-[48%] flex-col items-start justify-between rounded-md bg-[#2A60B1] px-5 py-6 pt-5 shadow-lg transition-all active:opacity-90 active:shadow-none"
      onPress={navigate}>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <Text className="font-manrope-bold text-xl text-[#1E4B8F]">🏝️</Text>
      </View>
      <View className="mt-2 w-full flex-row items-end justify-between">
        <View className="items-start">
          <Text className="mt-1 font-manrope text-base font-bold text-white">{name}</Text>
          <PriceTextComponent
            style="font-manrope text-base font-bold text-white"
            disabled={true}
            bitcoinAmount={balance}
          />
        </View>
        <View className="mb-0.5">
          <MonoIcon color="#FFFFFF" strokeWitdth={2.5} iconName="ArrowRight" />
        </View>
      </View>
    </Pressable>
  );
};

export default WalletMenuItem;
