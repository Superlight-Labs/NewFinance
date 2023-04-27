import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
};

const LoadingWalletItem = ({ name }: Props) => {
  return (
    <View className="w-[45rvw]">
      <View className="flex h-[40vw] w-[40vw] items-center justify-center rounded-xl bg-blue-100">
        <View className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-400">
          <MonoIcon height={32} width={32} strokeWitdth={4} iconName="Loading" color="white" />
        </View>
      </View>
      <Text className="mt-3 font-inter-medium">{name}</Text>
      <Text className="text-gray-500 font-inter">0 BTC</Text>
    </View>
  );
};

export default LoadingWalletItem;
