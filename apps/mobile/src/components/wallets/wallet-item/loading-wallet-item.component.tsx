import MonoIcon from 'components/shared/mono-icon/mono-icon.component';
import { Text, View } from 'utils/wrappers/styled-react-native';

type Props = {
  name: string;
};

const LoadingWalletItem = ({ name }: Props) => {
  return (
    <View className="w-[45rvw]">
      <View className="flex h-[40vw] w-[40vw] items-center justify-center rounded-xl bg-superblue-100">
        <View className="flex h-16 w-16 items-center justify-center rounded-md bg-superblue-400">
          <MonoIcon height={32} width={32} strokeWitdth={4} iconName="Loading" color="white" />
        </View>
      </View>
      <Text className="mt-3">{name}</Text>
      <Text className="text-gray-500">0 BTC</Text>
    </View>
  );
};

export default LoadingWalletItem;
