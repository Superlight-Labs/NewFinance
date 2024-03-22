import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import PriceTextComponent from 'components/shared/price-text/price-text.component';
import { ActivityIndicator } from 'react-native';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
};

const LoadingWalletItem = ({ name }: Props) => {
  return (
    <View className="mb-4 flex aspect-[1] h-56 w-[48%]  justify-between rounded-md bg-[#F8F8F8] px-5 py-5">
      <View className="flex-row justify-between ">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
          <ActivityIndicator />
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
        <View>
          <MonoIcon iconName="ArrowRight" />
        </View>
      </View>
    </View>
  );
};

export default LoadingWalletItem;
